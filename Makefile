# FGMap Makefile
#
# This Makefile doesn't build anything. Instead it's a convenient script for
# configuring and "installing" FGMap.
#
# Edit fgmap.keys and put your Google Map API keys


all: fg_server_map.html

fg_server_map.html: fg_server_map.html.in fgmap.keys fgmap.servers
	./gen-fg_server_map.html.pl

clean:
	rm -f fg_server_map.html

