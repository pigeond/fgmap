
SG_PREFIX ?= /home/pigeon/src/FG/sg-plib/install/usr/local
PLIB_PREFIX ?= /home/pigeon/src/FG/plib-svn/trunk/install/usr

CXXFLAGS += -I$(SG_PREFIX)/include -I$(PLIB_PREFIX)/include

SWIG ?= /usr/bin/swig
PERL ?= /usr/bin/perl
MAKE ?= /usr/bin/make

PM_NAME = sgmath

SWIG_INPUT = $(PM_NAME).i
SWIG_OUTPUT = $(PM_NAME).pm $(PM_NAME)_wrap.cxx

MAKEFILE_PL = Makefile.PL
MAKEFILE_PERL = Makefile.perl

SOURCES = sgmath.cxx
OBJECTS = sgmath.o

# TODO: determine ARCH automatically
ARCH=x86-32

PM = blib-$(ARCH)/arch/auto/sgmath/sgmath.so



all: $(SWIG_OUTPUT) $(MAKEFILE_PERL) $(OBJECTS) $(PM)

$(SWIG_OUTPUT): $(SWIG_INPUT)
	$(SWIG) -perl5 -c++ $(CXXFLAGS) $<

$(MAKEFILE_PERL): $(MAKEFILE_PL)
	LDFLAGS=-L$(SG_PREFIX)/lib $(PERL) $<

$(OBJECTS): $(SOURCES)
	$(CXX) -c $^ -o $@ $(CXXFLAGS) -fPIC

$(PM):
	$(MAKE) -f $(MAKEFILE_PERL) SG_PREFIX=$(SG_PREFIX)

clean:
	rm -rf $(SWIG_OUTPUT) $(MAKEFILE_PERL) $(PM) *.o blib-$(ARCH)

