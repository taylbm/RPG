# Makefile for RPG boost-python extension library

include $(MAKEINC)/make.common
include $(MAKEINC)/make.$(ARCH)

LIBMAKEFILES = py_rpg.mak

include $(MAKEINC)/make.parent_lib

