#include <cstring>
#include <fstream>
#include <iostream>
#include <sstream>
#include <unordered_map>
#include <vector>
using namespace std;
using u32 = unsigned int;

vector<u32> parse(const string &path) {
  fstream file(path);
  unordered_map<string, vector<u32>> map;
  if (!file.is_open()) {
    cout << "Unable to open " << path << endl;
    throw;
  }

  string str;
  u32 counts[5], descriptors[6];
  u32 none_group_counter = 0;

  getline(file, str);
  while (getline(file, str)) {
    size_t column = 0;
    stringstream line_stream(str);

    while (getline(line_stream, str, ',') && column <= 7) {
      if (column++ >= 2)
        counts[column - 1] = stoi(str);
    }

    while (getline(line_stream, str, ',') && column < 13) {
      if (column++ >= 8)
        descriptors[column - 8] = stoi(str);
    }
    if (!strcmp("NONE", str.c_str())) {
      str = "SOLO_" + std::to_string(none_group_counter++);
    }
    vector<u32> *group_data = nullptr;
    {
      auto pair = map.find(str);
      if (pair != map.end()) {
        group_data = &pair->second;
      } else {
        map.insert({str, vector(25, (u32)0)});
        group_data = &map[str];
      }
    }

    for (u32 holdtype = 0; holdtype < group_data->size(); holdtype++) {
      for (u32 size = 0; size < 5; size++) {
        if (descriptors[size]) {
          group_data->data()[5 * holdtype + size] += counts[holdtype];
        }
      }
    }
  }

  size_t assigned = 0;
  vector<u32> data(25 * map.size(), (u32)0);

  for (auto &pair : map) {
    memcpy(data.data() + assigned, pair.second.data(),
           pair.second.size() * sizeof(u32));
    assigned += pair.second.size();
  }

  cout << "Parse success " << path << " into " << map.size() << " groups"
       << endl;
  return data;
}
