
# RCS info
# $Author: ccalvert $
# $Locker:  $
# $Date: 2005/06/02 14:54:56 $
# $Id: cpc102_tsk001.make,v 1.1 2005/06/02 14:54:56 ccalvert Exp $
# $Revision: 1.1 $
# $State: Exp $

# This is the parent make description file for the DQD tool

include $(MAKEINC)/make.common
include $(MAKEINC)/make.$(ARCH)

install::
	@if [ -d $(TOOLSCRIPTDIR) ]; then set +x; \
	else (set -x; $(MKDIR) $(TOOLSCRIPTDIR)); fi
	$(INSTALL) $(INSTBINFLAGS) dqdwalk.py $(TOOLSCRIPTDIR)/dqdwalk
	$(INSTALL) $(INSTBINFLAGS) dqd.py $(TOOLSCRIPTDIR)/dqd
	tar -C $(MAKETOP)/cfg --overwrite -xf dqd.tar.gz
	cp dqd.conf $(MAKETOP)/cfg/dqd.conf
