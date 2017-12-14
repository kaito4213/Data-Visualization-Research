# -*- coding: utf-8 -*-
"""
Created on Thu Feb 23 21:13:48 2017

@author: yimin lin
"""

fhand = open('1.txt','r')
lst = []
lst2 = []
for line in fhand:
    line = line.rstrip().split()
    lst.append(line)
for i in range(1, len(lst)):
    temp = {}
    lst[i][1] = int(lst[i][1])
    temp['state'] = lst[i][0]
    temp['death'] = lst[i][1]
    lst2.append(temp)
print(lst2)