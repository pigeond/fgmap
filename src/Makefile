
SG_PREFIX ?= /home/pigeon/src/FG/simgear-cvs/_install/usr/local

CXXFLAGS ?= -g -W -Wall -I$(SG_PREFIX)/include
LDFLAGS ?= -L$(SG_PREFIX)/lib -lsgmath

PROG = ../fg_server_xml.cgi

$(PROG): fg_server_xml.cxx
	$(CXX) $(CXXFLAGS) -o $@ $^ $(LDFLAGS)

clean:
	rm -f $(PROG)

