use ExtUtils::MakeMaker;
WriteMakefile(
	'FIRST_MAKEFILE' => 'Makefile.perl',
	'NAME' => 'sgmath',
	'CC' => '$(CXX)',
	'LD' => '$(CXX)',
	'OBJECT' => 'sgmath.o sgmath_wrap.o'
);

