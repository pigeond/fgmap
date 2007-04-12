use ExtUtils::MakeMaker;
WriteMakefile(
	'FIRST_MAKEFILE' => 'Makefile.perl',
	'NAME' => 'sgmath',
	'LIBS' => '-lsgmath',
	'CC' => '$(CXX)',
	'LD' => '$(CXX)',
	'OBJECT' => 'sgmath.o sgmath_wrap.o $(SG_PREFIX)/lib/libsgmath.a'
);

