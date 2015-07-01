# RCS info
# $Author: jeffs $
# $Locker:  $
# $Date: 2015/03/12 20:33:06 $
# $Id: en_lib.mak,v 1.22 2015/03/12 20:33:06 jeffs Exp $
# $Revision: 1.22 $
# $State: Exp $

include $(MAKEINC)/make.common
include $(MAKEINC)/make.$(ARCH)

LOCAL_INCLUDES = -I/usr/include/python2.4 

# You can also include architecture specific includes, if needed, by
# defining $(ARCH)_INC and then adding it to the list of ALL_INCLUDES.

LOCAL_DEFINES =

SHRDLIBLD_SEARCHLIBS = -lboost_python -lorpg -linfr

# You can also include architecture specific defines, if needed, by
# defining $(ARCH)_DEF and then adding it to the list of ALL_DEFINES.

ALL_INCLUDES = $(STD_INCLUDES) $(LOCALTOP_INCLUDES) $(TOP_INCLUDES) \
			 $(LOCAL_INCLUDES) $(SYS_INCLUDES)

# This is a list of all defines.
ALL_DEFINES = $(STD_DEFINES) $(OS_DEFINES) $(LOCAL_DEFINES) $(SYS_DEFINES)

CCFLAGS = $(COMMON_CCFLAGS) $(ALL_INCLUDES) $(ALL_DEFINES)
DEBUGCCFLAGS = $(COMMON_CCFLAGS) $(ALL_INCLUDES) $(ALL_DEFINES)
DEPENDFLAGS =

LIB_CXXSRCS =	wrap_liborpg.cpp \
		wrap_rpg.cpp \
		wrap_rpg_messages.cpp \
		wrap_types.cpp \
		wrap_rpg_rda.cpp \
		wrap_rda_status.cpp

LIB_TARGET = _rpg

DEPENDFILE = ./depend.$(LIB_TARGET).$(ARCH)

include $(MAKEINC)/make.cflib

#
# change the target name so it's importable by python
#

liball:: rntarget

rntarget:
	mv $(ARCH)/lib_rpg.so $(ARCH)/_rpg.so

# We don't need to install this library anymore

#libinstall::
#	$(RM) $(LIBDIR)/lib$(LIB_TARGET).*

-include $(DEPENDFILE)
