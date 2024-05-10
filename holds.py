import numpy as np
from random import randint
import pandas as p

cheeta = p.read_csv("./OrderForms/Cheeta.csv")
bp = p.read_csv("./OrderForms/BluePill.csv")
xcult = p.read_csv("./OrderForms/XCult.csv")

cheeta_data = np.matrix([row[1:22] for row in cheeta.values[49:]])
bp_data = np.matrix([[int(i) for i in row[:21]] for row in bp.values[26:]])
xcult_data = np.matrix([[int(i) for i in row[:21]]
                        for row in xcult.values[55:]])

numberCol = 6
cheeta_colour = np.zeros((numberCol, len(cheeta_data)))
bp_colour = np.zeros((numberCol, len(bp_data)))
xcult_colour = np.zeros((numberCol, len(xcult_data)))


def rcol(colour_mat):
    cpy = colour_mat.copy()
    for x in range(len(colour_mat[0])):
        yval = randint(0, len(colour_mat)-1)
        cpy[yval][x] = 1
    return cpy


def colour_matmul(cols):
    return cols[0]*cheeta_data + cols[1] * bp_data + cols[2] * xcult_data


def compute_score(colours):
    mat = colour_matmul(colours)
    variances = np.zeros(mat.shape[1])
    for x in range(mat.shape[1]):
        variances[x] = np.sqrt(np.var(mat[:, x]))
    return np.mean(variances)


def pprint(mat):
    for r in mat:
        print("[", end="")
        for (_ind, e) in np.ndenumerate(r):
            print(f"{int(e):3}", end=" ")
        print("]")
    return


colours = [rcol(cheeta_colour), rcol(bp_colour), rcol(xcult_colour)]
score = compute_score(colours)

runnum = 10

for i in range(runnum):
    new_cols = [rcol(cheeta_colour), rcol(bp_colour), rcol(xcult_colour)]
    s = compute_score(new_cols)
    if s < score:
        score = s
        colours = new_cols

# for (name, c) in zip(["Cheeta", "BluePill", "XCult"], colours):
#    print(name)
#    pprint(np.transpose(c))

# print("Summary")
# pprint(colour_matmul(colours))
string = """1  0  0  0  0  0
0  0  0  0  1  0
0  0  0  1  0  0
1  0  0  0  0  0
0  1  0  0  0  0
0  0  0  1  0  0
0  0  0  0  0  1
0  0  0  0  0  1
0  0  1  0  0  0
0  1  0  0  0  0
0  0  1  0  0  0
0  0  0  1  0  0
0  0  0  0  0  1
0  0  0  1  0  0
0  0  0  0  0  1
1  0  0  0  0  0
0  1  0  0  0  0
0  0  0  0  1  0
0  0  0  0  1  0
1  0  0  0  0  0
0  0  0  1  0  0
0  0  0  0  1  0
0  1  0  0  0  0
0  0  0  1  0  0
0  0  0  1  0  0
1  0  0  0  0  0
0  0  0  0  1  0
0  0  1  0  0  0
0  0  0  0  1  0
0  0  0  1  0  0
0  1  0  0  0  0
0  1  0  0  0  0
0  0  0  1  0  0
0  0  0  1  0  0
0  0  1  0  0  0"""


final = [[int(j) for j in i.split(' ') if j != '']
         for i in string.split('\n') if i != '']
for i in final:
    print(i.index(1))
