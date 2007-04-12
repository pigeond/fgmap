#!/usr/bin/perl

use strict;
use lib "./blib/lib";
use lib "./blib/arch/auto/sgmath";
use sgmath;


my($head, $pitch, $roll) = sgmath::euler_get(20, 120, 1, 2, 3);

print("$head, $pitch, $roll\n");

