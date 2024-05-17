#include <cassert>
#include <chrono>
#include <fstream>
#include <iostream>
#include <random>
#include <sstream>
#include <vector>

using namespace std;
using u32 = unsigned int;
using u8 = unsigned char;
#define NUM_COLOURS 6
#define NUM_TYPES 25

void parse(const string &path, vector<u32> &matrix, vector<string> &groups) {
  fstream file(path);
  assert(file.is_open());

  string str;
  u32 counts[5];
  bool descriptors[5];

  getline(file, str);
  while (getline(file, str)) {
    size_t column = 0;
    stringstream line_stream(str);

    while (getline(line_stream, str, ',') && column <= 7) {
      if (column++ >= 2) {
        counts[column - 1] = stoi(str);
      }
    }

    while (getline(line_stream, str, ',') && column <= 12) {
      if (column++ >= 8) {
        descriptors[column - 8] = str[0] == '1';
      }
    }

    u32 group_data_offset;
    bool found = false;
    for (size_t idx = groups.size() - 1; idx < groups.size(); idx--) {
      if (groups[idx] == str) {
        found = true;
        group_data_offset = idx * NUM_TYPES;
        break;
      }
    }
    if (!found) {
      groups.push_back(str);
      group_data_offset = matrix.size();
      matrix.resize(matrix.size() + 25, 0);
    }

    for (u32 holdtype = 0; holdtype < 5; holdtype++) {
      for (u32 size = 0; size < 5; size++) {
        if (descriptors[size]) {
          matrix[group_data_offset + 5 * holdtype + size] += counts[holdtype];
        }
      }
    }
  }
}

void generate_colours(vector<u8> &colours) {
  static random_device rd;
  static mt19937 eng(rd());
  static uniform_int_distribution<> distr(0, NUM_COLOURS - 1);
  for (u8 &x : colours)
    x = distr(eng);
}

float score(const vector<u32> &matrix, const vector<u8> &colours,
            u32 (&count)[NUM_COLOURS * NUM_TYPES], float (&mean)[NUM_TYPES]) {
  fill(count, count + NUM_COLOURS * NUM_TYPES, 0);

  for (size_t group = 0; group < colours.size(); group++) {
    size_t col = colours[group];
    for (size_t type = 0; type < NUM_TYPES; type++) {
      count[type * NUM_COLOURS + col] += matrix[group * NUM_TYPES + type];
    }
  }

  for (size_t type = 0; type < NUM_TYPES; type++) {
    mean[type] = 0.0f;
    for (size_t col = 0; col < NUM_COLOURS; col++) {
      mean[type] += count[type * NUM_COLOURS + col];
    }
    mean[type] /= NUM_COLOURS;
  }

  float average_stdv = 0.0f;
  for (size_t type = 0; type < NUM_TYPES; type++) {
    float var = 0.0f;
    for (size_t col = 0; col < NUM_COLOURS; col++) {
      float diff = count[type * NUM_COLOURS + col] - mean[type];
      var += diff * diff;
    }
    average_stdv += std::sqrtf(var);
  }

  return average_stdv / NUM_TYPES;
}
