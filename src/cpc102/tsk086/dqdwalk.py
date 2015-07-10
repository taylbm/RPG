#!/usr/bin/python

from optparse import OptionParser
import bisect
import bz2
import datetime
import numpy as np
import os
import simplejson as json
import struct
import subprocess
import sys
import time
import xdrlib

MonthToNumber = {
    'Jan':      1,
    'Feb':      2,
    'Mar':      3,
    'Apr':      4,
    'May':      5,
    'Jun':      6,
    'Jul':      7,
    'Aug':      8,
    'Sep':      9,
    'Oct':      10,
    'Nov':      11,
    'Dec':      12
}

def get_options():
    parser = OptionParser()

    parser.add_option(
        '-c',
        '--config_file',
        dest = 'config_file',
        default = os.path.join(os.environ['CFG_DIR'], 'dqd.conf'),
        help = 'configuration file for controlling the DQD Walk tool [default: %default]',
        action = 'store',
        type = 'string'
    )

    (opts, args) = parser.parse_args()
    
    if os.path.exists(opts.config_file) is False:
        print('XXX> Could not find configuration file!')
        parser.print_help()
        
        return None

    return (opts, args)

def parse_date_time(zdr_date_time_str):
    item_time_comps = zdr_date_time_str.replace('[', '').replace(']', '').replace(',', ' ').replace(':', ' ').split(' ')
    year = int(item_time_comps[2])
    
    if year < 50:
        year += 2000
    else:
        year += 1900
    
    month = MonthToNumber[item_time_comps[0]]
    day = int(item_time_comps[1])
    hour = int(item_time_comps[3])
    minute = int(item_time_comps[4])
    second = int(item_time_comps[5])
    
    return datetime.datetime(year, month, day, hour, minute, second)

def parse_zdr_stats(zdr_split):
    if len(zdr_split) != 2:
        return None
        
    print(zdr_split[1])

    if '(Bragg)' in zdr_split[1]:
        if 'Unavailable' in zdr_split[1] or 'Last detection' in zdr_split[1]:
            return None
    
        stat_date_time = parse_date_time(zdr_split[0])
        take_from = zdr_split[1][zdr_split[1].index(':') + 1:].rstrip('\0')
    
        (twelve_vol_bias, twelve_vol_count, cur_vol_bias, cur_vol_count, cur_vol_iqr, cur_vol_90, cur_vol_vcp) = take_from.split('/')
       
        if float(twelve_vol_bias) > -99: 
            return {
                'type': 'bragg',
                'time': time.mktime(stat_date_time.timetuple()),
                'volumeBias':   {
                    'last12':       float(twelve_vol_bias),
                    'current':      float(cur_vol_bias)
                }
            }
        else:
            return None
    else:
        take_from = zdr_split[1][zdr_split[1].index(':') + 1:].rstrip('\0')
        (rain_raw, dry_snow_raw) = take_from.split(' DS ')
        
        stat_date_time = parse_date_time(zdr_split[0])
        
        #
        # still have csv info to split here
        #
        
        rain_raw = rain_raw.split(',')
        
        #
        # now split the fields that are / delimited
        #
        
        (zdr_error_rain, first_zdr_refl_cat) = rain_raw[0].split('/')
        (last_zdr_refl_cat, total_num_rain_bins, first_std_dev) = rain_raw[5].split('/')
        (zdr_error_snow, total_num_snow_bins, stddev_snow) = dry_snow_raw.split('/')
                
        if float(zdr_error_rain) > -99:
            return {
                'time': time.mktime(stat_date_time.timetuple()),
                'rain': {
                    'zdrError':         float(zdr_error_rain)
                },
                'snow':    {
                    'zdrError':         float(zdr_error_snow)
                }
            }
        else:
            return None

class unpack_comps(object):
    def __init__(self, xdr):
        self.xdr = xdr
        
    def unpack_params(self):
        return {
            'parameter_id':         self.xdr.unpack_string(),
            'parameter_attributes': self.xdr.unpack_string()
        }
        
    def single_comp(self):
        code = struct.unpack('>i', self.xdr.unpack_fopaque(4))[0]
        
        if code == 4:        
            return {
                'number_of_component_parameters':   struct.unpack('>i', self.xdr.unpack_fopaque(4))[0],
                'parameters':                       self.xdr.unpack_array(self.unpack_params),
                'text':                             self.xdr.unpack_string()
            }
        
    def __call__(self):
        return self.xdr.unpack_array(self.single_comp)

class TermHandler(object):
    def __init__(self, proc):
        self.proc = proc

    def __call__(self, signum, frame):
        print('--> terminating process')
        os.kill(self.proc.pid, signal.SIGTERM)

if __name__ == '__main__':
    #
    # locals
    #
    
    zdr_stats_raw = []
    zdr_stats_split = []
    output_dir = os.path.join(os.environ['CFG_DIR'], 'dqd')
    output_file = os.path.join(output_dir, 'summary.js')
    
    #
    # first get the options
    #

    t = get_options()

    if t is None:
        sys.exit()

    (options, args) = t

    #
    # now let's read in the configuration
    #

    f = open(options.config_file, 'r')

    try:
        config = json.load(f)
    finally:
        f.close()

    #
    # now let's try and open the LB and get header info (the first 18 bytes)
    #

    #args = [config['lbInfo']['command']['exec']] + config['lbInfo']['command']['args'] 
    args = ['standalone_dsp', '-l', '3029', '-g', '"ZDR Stats"', '-t']
    print('--> running command: %s' %' '.join(args))
    lb_dump_proc = subprocess.Popen(
        [' '.join(args)],
        shell = True,
        stdout = subprocess.PIPE,
        stderr = subprocess.PIPE
    )

    print('--> retrieving output')
    out = lb_dump_proc.communicate()

    print('--> parsing ASP data')
    zdr_stats_raw = out[0].split('\n')
    raw_split = [parse_zdr_stats(zdr_stat.split('>>')) for zdr_stat in zdr_stats_raw]
    zdr_stats_split += [zdr_stat for zdr_stat in raw_split if zdr_stat is not None]
        
    #
    # now it's time to do the maths
    #

    print('--> Finished decoding, now computing (this may take a couple of minutes)')
    zdr_processed = zdr_stats_split
    zdr_processed = sorted((z for z in zdr_processed if z is not None), key = lambda x: x['time'])
    print('--> Found %s zdr stats' %len(zdr_processed))
    
    times = [datetime.date.fromtimestamp(z['time']) for z in zdr_processed]
    i = 0
    summary = []
    
    while i < len(zdr_processed):
        el = zdr_processed[i]
        now = times[i]
        day_7 = now + datetime.timedelta(days = 7)
        idx_7 = bisect.bisect(times[i:], day_7)
        idx_today = bisect.bisect(times[i:], now)
        els = zdr_processed[i:i + idx_7]
        
        #
        # we'll catch IndexErrors, although it's POSSIBLE they are raised for 
        # something other than a 0-length array, it's not likely, so I'm willing
        # to assume the risk
        #
        
        try:
            median_rain = np.median([z['rain']['zdrError'] for z in els if 'rain' in z and z['rain']['zdrError'] > -99.0])
        except IndexError:
            median_rain = -99.0
            
        try:
            median_snow = np.median([z['snow']['zdrError'] for z in els if 'snow' in z and z['snow']['zdrError'] > -99.0])
        except IndexError:
            median_snow = -99.0
            
        try:
            median_bragg = np.median([z['volumeBias']['last12'] for z in els if 'type' in z and z['volumeBias']['last12'] > -99.0])
        except IndexError:
            median_bragg = -99.0
            
        print('--> %s %s %s %s (found %s rain, %s snow, %s Bragg)' %(i, now, idx_today, idx_7, median_rain, median_snow, median_bragg))
        summary.append({'time': time.mktime(now.timetuple()), 'medianRain': median_rain, 'medianSnow': median_snow, 'medianBragg': median_bragg})
        
        i += idx_today
    
    to_write = json.dumps(summary)
    
    if os.path.exists(output_dir) is False:
        print('--> creating output directory: %s' %output_dir)
        os.makedirs(output_dir)
    
    f = open(output_file, 'w')
    f.write('var SummaryData = %s;' %to_write)
    f.close()
    
