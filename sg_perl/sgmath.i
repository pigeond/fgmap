
%module sgmath

%{
#include "sgmath.hxx"
%}

%include "typemaps.i"
%apply float *OUTPUT { float *head, float *pitch, float *roll };
%include "sgmath.hxx"

