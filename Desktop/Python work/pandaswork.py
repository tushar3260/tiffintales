import pandas as pd

data = [10,20,30,40,50,60,70,80,90,100]

data2 = {'a': 100, 'b': 200, 'c': 300}


data3 = {
    'Calories': [420, 380, 390, 350, 500],
    'Duration': [50, 40, 45, 30, 60]
}

data4={
    
    'name': ['Tom', 'Jerry', 'Mickey', 'Donald'],
    'age': [20, 21, 19, 18],    
    'city': ['New York', 'Los Angeles', 'Chicago', 'Houston']
}
indexes = ['P1', 'P2', 'P3', 'P4']

# Create DataFrame with index
df = pd.DataFrame(data4, index=indexes)

# df=pd.Series(data)


# print(df)
# print(pd.Series(data2))
# print(pd.Series(data3))
# print(pd.DataFrame(data3))


print(df)