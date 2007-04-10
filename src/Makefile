
SG_PREFIX ?= /home/pigeon/src/FG/sg-plib/install/usr/local
PLIB_PREFIX ?= /home/pigeon/src/FG/plib-svn/trunk/install/usr

CXXFLAGS ?= -g -W -Wall -I$(SG_PREFIX)/include -I$(PLIB_PREFIX)/include
LDFLAGS ?= -L$(SG_PREFIX)/lib -lsgmath

PROG = fg_server_xml.cgi

$(PROG): fg_server_xml.cxx
	$(CXX) $(CXXFLAGS) -o $@ $^ $(LDFLAGS)

clean:
	rm -f $(PROG)

