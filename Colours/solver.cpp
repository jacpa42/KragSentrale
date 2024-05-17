#include "helper.cpp"

int main(int argc, char *argv[]) {
  auto timer = chrono::high_resolution_clock();
  auto start = timer.now();
  vector<string> groups;
  vector<u32> data;

  parse("./Cheeta.csv", data, groups);
  parse("./BluePill.csv", data, groups);
  parse("./XCult.csv", data, groups);
  parse("./FlatHold.csv", data, groups);

  vector<u8> colours(data.size() / NUM_TYPES);
  vector<u8> best(colours.size());

  u32 count[NUM_TYPES * NUM_COLOURS];
  float mean[NUM_TYPES];
  float best_score = 1e20;

  for (u32 i = 0; i < stof(argv[1]); i++) {
    generate_colours(colours);
    float s = score(data, colours, count, mean);
    if (s < best_score) {
      best_score = s, colours.swap(best);
    }
  }

  for (size_t i = 0; i < groups.size(); i++) {
    cout << best[i] + 0 << " " << groups[i] << "\n";
  }
}
