#include "helper.cpp"

// The goal is to choose the colour distrubution which minimizes the the average
// variance in the number of holds of a specific type.
//
// For example the second row below is better
//                       |  Red Green Blue | variance
// Version 0 : Crimps XS |  0   6     7    | 9.888
// Version 1 : Crimps XS |  4   6     3    | 4.666

int main() {
  auto cheeta_data = parse("./Cheeta.csv");
  return 0;
}
