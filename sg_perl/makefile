
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

PM = blib/arch/auto/sgmath/sgmath.so



all: $(SWIG_OUTPUT) $(MAKEFILE_PERL) $(OBJECTS) $(PM)

$(SWIG_OUTPUT): $(SWIG_INPUT)
	$(SWIG) -perl5 -c++ $(CXXFLAGS) $<

$(MAKEFILE_PERL): $(MAKEFILE_PL)
	$(PERL) $<

$(OBJECTS): $(SOURCES)
	$(CXX) -c $^ -o $@ $(CXXFLAGS) -fPIC

$(PM):
	$(MAKE) -f $(MAKEFILE_PERL)

clean:
	rm -rf $(SWIG_OUTPUT) $(MAKEFILE_PERL) $(PM) *.o blib

