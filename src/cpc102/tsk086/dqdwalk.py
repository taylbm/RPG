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
                }#,
                #'binCounts':    {
                #    'last12':       int(twelve_vol_count),
                #    'current':      int(cur_vol_count)
                #},
                #'stats':        {
                #    'iqr':          float(cur_vol_iqr),
                #    'percent90':    float(cur_vol_90)
                #},
                #'vcp':              int(cur_vol_vcp)
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
                    'zdrError':         float(zdr_error_rain)#,
                    #'measuredZdr':      [float(first_zdr_refl_cat)] + [float(z) for z in rain_raw[1:5]] + [float(last_zdr_refl_cat)],
                    #'totalBins':        int(total_num_rain_bins),
                    #'stdDev':           [float(first_std_dev)] + [float(s) for s in rain_raw[6:]]
                },
                'snow':    {
                    'zdrError':         float(zdr_error_snow),
                    #'totalBins':        int(total_num_snow_bins),
                    #'stdDev':           float(stddev_snow)
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
        
#        print('component code is: %s' %code)
        
        if code == 4:        
            return {
                'number_of_component_parameters':   struct.unpack('>i', self.xdr.unpack_fopaque(4))[0],
                'parameters':                       self.xdr.unpack_array(self.unpack_params),
                'text':                             self.xdr.unpack_string()
            }
        
    def __call__(self):
        return self.xdr.unpack_array(self.single_comp)

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

    args = [config['lbInfo']['command']['exec']] + config['lbInfo']['command']['args'] + ['-s', os.path.expanduser(config['lbInfo']['name'])]
    print('--> running command: %s' %' '.join(args))
    lb_dump_proc = subprocess.Popen(
        args,
        stdout = subprocess.PIPE,
        stderr = subprocess.PIPE
    )

    (stderr, stdout) = lb_dump_proc.communicate()

    at = 96
    total_length = len(stderr)
    
    while at < total_length:
        
        #
        # message header
        #
        
        hdr_fmt = '>2h2i3h'
        hdr_fmt_size = struct.calcsize(hdr_fmt) 
        (
            message_code,
            date_of_message,
            time_of_message,
            length_of_message,
            source_id,
            destination_id,
            number_blocks
        ) = struct.unpack(hdr_fmt, stderr[at:at + hdr_fmt_size])
        
#        print('''message_code: %s\n
#            date: %s\n
#            time: %s\n
#            length: %s\n
#            source: %s\n
#            destination: %s\n
#            num blocks: %s''' %(message_code, date_of_message, time_of_message, length_of_message, source_id, destination_id, number_blocks)
#        )
        
        #
        # description block
        #
        
        description_fmt = '>h2i7hihi25hI2B3I'
        description_fmt_size = struct.calcsize(description_fmt)
        (
            block_divider,
            latitude_of_radar,
            longitude_of_radar,
            height_of_radar,
            product_code,
            operational_mode,
            vcp,
            sequence_number,
            volume_scan_number,
            volume_scan_date,
            volume_scan_time,
            generation_date,
            generation_time,
            product_dependent_1,
            product_dependent_2,
            elevation_number,
            product_dependent_3,
            data_levels_1,
            data_levels_2,
            data_levels_3,
            data_levels_4,
            data_levels_5,
            data_levels_6,
            data_levels_7,
            data_levels_8,
            data_levels_9,
            data_levels_10,
            data_levels_11,
            data_levels_12,
            data_levels_13,
            data_levels_14,
            data_levels_15,
            data_levels_16,
            product_dependent_4,
            product_dependent_5,
            product_dependent_6,
            product_dependent_7,
            compression_method,
            uncompressed_size,
            version,
            spot_blank,
            offset_to_symbology,
            offset_to_graphic,
            offset_to_tabular
        ) = struct.unpack(description_fmt, stderr[at + hdr_fmt_size:at + hdr_fmt_size + description_fmt_size])
        
#        print('description size: %s' %description_fmt_size)
#        print('''
#            block_divider: %s\n
#            latitude_of_radar: %s\n
#            longitude_of_radar: %s\n
#            height_of_radar: %s\n
#            product_code: %s\n
#            operational_mode: %s\n
#            vcp: %s\n
#            sequence_number: %s\n
#            volume_scan_number: %s\n
#            volume_scan_date: %s\n
#            volume_scan_time: %s\n
#            generation_date: %s\n
#            generation_time: %s\n
#            product_dependent_1: %s\n
#            product_dependent_2: %s\n
#            elevation_number: %s\n
#            product_dependent_3: %s\n
#            data_levels_1: %s\n
#            data_levels_2: %s\n
#            data_levels_3: %s\n
#            data_levels_4: %s\n
#            data_levels_5: %s\n
#            data_levels_6: %s\n
#            data_levels_7: %s\n
#            data_levels_8: %s\n
#            data_levels_9: %s\n
#            data_levels_10: %s\n
#            data_levels_11: %s\n
#            data_levels_12: %s\n
#            data_levels_13: %s\n
#            data_levels_14: %s\n
#            data_levels_15: %s\n
#            data_levels_16: %s\n
#            product_dependent_4: %s\n
#            product_dependent_5: %s\n
#            product_dependent_6: %s\n
#            product_dependent_7: %s\n
#            compression_method: %s\n
#            uncompressed_size: %s\n
#            version: %s\n
#            spot_blank: %s\n
#            offset_to_symbology: %s\n
#            offset_to_graphic: %s\n
#            offset_to_tabular: %s\n
#        ''' %(
#            block_divider,
#            latitude_of_radar,
#            longitude_of_radar,
#            height_of_radar,
#            product_code,
#            operational_mode,
#            vcp,
#            sequence_number,
#            volume_scan_number,
#            volume_scan_date,
#            volume_scan_time,
#            generation_date,
#            generation_time,
#            product_dependent_1,
#            product_dependent_2,
#            elevation_number,
#            product_dependent_3,
#            data_levels_1,
#            data_levels_2,
#            data_levels_3,
#            data_levels_4,
#            data_levels_5,
#            data_levels_6,
#            data_levels_7,
#            data_levels_8,
#            data_levels_9,
#            data_levels_10,
#            data_levels_11,
#            data_levels_12,
#            data_levels_13,
#            data_levels_14,
#            data_levels_15,
#            data_levels_16,
#            product_dependent_4,
#            product_dependent_5,
#            product_dependent_6,
#            product_dependent_7,
#            compression_method,
#            uncompressed_size,
#            version,
#            spot_blank,
#            offset_to_symbology,
#            offset_to_graphic,
#            offset_to_tabular
#        ))
        
        #
        # symbology block
        #
        
        symbology_fmt = '>2hi2hi'
        symbology_fmt_size = struct.calcsize(symbology_fmt)
        start = at + offset_to_symbology * 2
        end = start + symbology_fmt_size
        symbology_data = bz2.decompress(stderr[start:start + uncompressed_size])
        try:
            (
                block_divider,
                block_id,
                length_of_block,
                number_of_layers,
                layer_divider,
                length_of_data_layer
            ) = struct.unpack(symbology_fmt, symbology_data[:symbology_fmt_size])
        except:
            print('WWW> Symbology size mismatch, skipping')
            at += length_of_message + 96
            continue
        
#        print('''block_divider: %s\n
#            block id: %s\n
#            length of block: %s\n
#            number_of_layers: %s\n
#            layer divider: %s\n
#            length of data layer: %s
#        ''' %(block_divider, block_id, length_of_block, number_of_layers, layer_divider, length_of_data_layer)
#        )
        
        #
        # packets
        #
        
        packet_code = struct.unpack('>h', symbology_data[symbology_fmt_size:symbology_fmt_size + 2])[0]
#        print('packet_code: %s' %packet_code)
        
        if packet_code == 28 or packet_code == 29:      # generic data packet, 2 bytes reserved after packet code
            serialized_data_length = struct.unpack('>i', symbology_data[symbology_fmt_size + 2 + 2:symbology_fmt_size + 2 + 2 + 4])[0]
#            print('serialized_data_length: %s' %serialized_data_length)
            
            #
            # unpack XDR data
            #
            
            xdr_data = xdrlib.Unpacker(symbology_data[symbology_fmt_size + 2 + 2 + 4:symbology_fmt_size + 2 + 2 + 4 + serialized_data_length])
            
            if packet_code == 28:
                name = xdr_data.unpack_string()
                desc = xdr_data.unpack_string()
                code = struct.unpack('>i', xdr_data.unpack_fopaque(4))[0]
                type = struct.unpack('>i', xdr_data.unpack_fopaque(4))[0]
                gen_time = struct.unpack('>I', xdr_data.unpack_fopaque(4))[0]
                radar_name = xdr_data.unpack_string()
                radar_latitude = xdr_data.unpack_float()
                radar_longitude = xdr_data.unpack_float()                    
                radar_height = xdr_data.unpack_float()
                volume_scan_start_time = struct.unpack('>I', xdr_data.unpack_fopaque(4))[0]                
                elevation_scan_start_time = struct.unpack('>I', xdr_data.unpack_fopaque(4))[0]
                elevation_angle = xdr_data.unpack_float()                    
                volume_scan_number = struct.unpack('>i', xdr_data.unpack_fopaque(4))[0]
                
                #xdr_data.set_position(xdr_data.get_position() + 4)
                
                #
                # b/c the python xdr library (really the xdr spec) assumes 4-bytes is the smallest data chunk, we 
                # need to deserialize the rest of the data description by unpacking "manually"
                #
                
#                (
#                    operational_mode,
#                    vcp,                
#                    elevation_number,                    
#                    spare_short,
#                    spare_int,
#                    number_of_parameters,
#                    parameter_list_pointer,
#                    number_of_components,
#                    component_list_pointer
#                ) = struct.unpack('>4h2iIiI', xdr_data.unpack_fopaque(28))

                operational_mode = struct.unpack('>i', xdr_data.unpack_fopaque(4))[0]
                vcp = struct.unpack('>i', xdr_data.unpack_fopaque(4))[0]                
                elevation_number = struct.unpack('>i', xdr_data.unpack_fopaque(4))[0]                    
                spare_short = struct.unpack('>i', xdr_data.unpack_fopaque(4))[0]
                spare_int = struct.unpack('>i', xdr_data.unpack_fopaque(4))[0]
                number_of_parameters = struct.unpack('>i', xdr_data.unpack_fopaque(4))[0]
                parameter_list_pointer = None
                
                if number_of_parameters > 0:
                    parameter_list_pointer = {
                        'param_id':             xdr_data.unpack_string(),
                        'param_attributes':     xdr_data.unpack_string()
                    }
                number_of_components = struct.unpack('>i', xdr_data.unpack_fopaque(4))[0]
                component_list = xdr_data.unpack_array(unpack_comps(xdr_data))
                
#                print('''
#                    name: %s\n
#                    desc: %s\n
#                    code: %s\n
#                    type: %s\n
#                    gen time: %s\n
#                    radar name: %s\n
#                    radar lat: %s\n
#                    radar lon: %s\n
#                    radar height: %s\n
#                    volume scan start time: %s\n
#                    volume scan number: %s\n
#                    operational mode: %s\n
#                    vcp: %s\n
#                    elevation number: %s\n
#                    number of parameters: %s\n
#                    parameter pointer: %s\n
#                    number of componenets: %s\n
#                    components: %s
#                    ''' %(name, 
#                        desc, 
#                        code, 
#                        type, 
#                        gen_time, 
#                        radar_name, 
#                        radar_latitude, 
#                        radar_longitude, 
#                        radar_height,
#                        volume_scan_start_time,
#                        volume_scan_number,
#                        operational_mode,
#                        vcp,
#                        elevation_number,
#                        number_of_parameters,
#                        parameter_list_pointer,
#                        number_of_components,
#                        '\n'.join([c[0]['text'] for c in component_list])
#                    )
#                )
                zdr_stats_raw += [c[0]['text'] for c in component_list if 'ZDR Stats' in c[0]['text']]
                raw_split = [parse_zdr_stats(zdr_stat.split('>>')) for zdr_stat in zdr_stats_raw]
#                zdr_stats_split += [zdr_stat.split(' >> ') for zdr_stat in zdr_stats_raw]
                zdr_stats_split += [zdr_stat for zdr_stat in raw_split if zdr_stat is not None]
                
            else:
                pass
        
        at += length_of_message + 96
        
    #
    # now it's time to do the maths
    #

    print('--> Finished decoding, now computing (this may take a couple of minutes)')
#    zdr_processed = (parse_zdr_stats(z) for z in zdr_stats_split)
#    zdr_processed = (z for z in zdr_processed if z is not None)
    zdr_processed = zdr_stats_split

    #
    # free some memory
    #

#    del zdr_stats_split

    print('--> Freed memory and finished parsing, now sorting just in case')
    zdr_processed = sorted((z for z in zdr_processed if z is not None), key = lambda x: x['time'])
    print('--> Found %s zdr stats' %len(zdr_processed))
    
#    to_write = json.dumps(zdr_processed)
#    
#    f = open('static/output.js', 'w')
#    f.write('var AllData = %s;' %to_write)
#    f.close()
    
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
    
