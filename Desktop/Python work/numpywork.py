import numpy as np
import random


rows1 = int(input("Pehle matrix ke rows daalo: "))
cols1 = int(input("Pehle matrix ke columns daalo: "))

arr1 = []
for i in range(rows1):
    row = []
    for j in range(cols1):
        value = random.randint(1, 10)  
        row.append(value)
    arr1.append(row)

rows2 = int(input("Dusre matrix ke rows daalo: "))
cols2 = int(input("Dusre matrix ke columns daalo: "))

arr2 = []
for i in range(rows2):
    row2 = []
    for j in range(cols2):
        value = random.randint(1, 10)  
        row2.append(value)
    arr2.append(row2)

mat1 = np.array(arr1)
mat2 = np.array(arr2)


print("\nMatrix 1:")
print(mat1)
print("\nMatrix 2:")
print(mat2)

if mat1.shape != mat2.shape:
    print("wrong matrix")
else:
    # print("\n Addition:")
    # print(np.add(mat1, mat2))

    # print("\n Subtraction:")
    # print(np.subtract(mat1, mat2))

    # print("\n Multiplication:")
    # print(np.multiply(mat1, mat2))
    # print()
    print(np.dot(mat1, mat2))

    # print("\n Division:")
    # print(np.divide(mat1, mat2))

    # print("\n Square root1:")
    # print(np.sqrt(mat1))

    # print("\n Square root2:")
    # print(np.sqrt(mat2))

    # print("\nGreater comparison :")
    # print(np.greater(mat1, mat2))

    # print("\nLess comparison:")
    # print(np.less(mat1, mat2))

    # print("\nEqual comparison:")
    # print(np.equal(mat1, mat2))

    print()
    print()
    print()
    # print(np.reshape(mat1, (4, 3)))