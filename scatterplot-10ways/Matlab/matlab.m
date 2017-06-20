cars = fopen('..\cars-sample.csv');
data = textscan(cars, '%s%s%s%s%f%d%s%f%f%d%s', 'delimiter',',', 'HeaderLines',1);
fclose(cars);
Weight = data{8};
MPG = data{4};
Manufacturer = data{3};
% new_data = [Weight, MPG, Manufacturer];
n = size(MPG);
for i = 1:n
   if  strcmp(MPG(i),'NA')
       MPG{i} = '15' ;
   end   
   if  strcmp(Manufacturer(i),'bmw')
        Manufacturer{i} = '1';
   else
       if strcmp(Manufacturer(i),'ford')
        Manufacturer{i} = '2';
       else
           if strcmp(Manufacturer(i),'mercedes')
              Manufacturer{i} = '3';
           else
               if strcmp(Manufacturer(i),'toyota')
                 Manufacturer{i} = '4';
               else 
                  Manufacturer{i} = '5';
               end
           end
       end
   end
end

MPG = str2double(MPG);
c = str2double(Manufacturer);
%axis=([1500 5000 10 50]);
fig = scatter(Weight, MPG, Weight/50, c,'filled');
xlabel('Weight');
ylabel('MPG');
alpha(.5)
