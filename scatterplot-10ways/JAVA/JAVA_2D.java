import javax.swing.*;
import java.io.BufferedReader;
import java.io.FileReader;
import java.util.*;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.Color;

/**
 * Main class to visualize car sample data
 */
public class CarsSample extends JFrame {

    /**
     * the width of the application window
     */
    private static int windowWidth = 1000;

    /**
     * the height of the application window
     */
    private static int windowHeight = 1000;

    /**
     * entry point
     *
     * @param args runtime arguments
     */
    public static void main(String[] args) {
        CarsSample carsSample = new CarsSample();
        carsSample.visualize();
    }

    /**
     * Visualization
     */
    private void visualize() {
        this.add(new ScatteredCarPlot());
        this.setSize(CarsSample.windowWidth, CarsSample.windowHeight);
        this.setDefaultCloseOperation(WindowConstants.EXIT_ON_CLOSE);
        this.setVisible(true);
    }
}

/**
 * A class that draws the scatter plot
 */
class ScatteredCarPlot extends JPanel {

    /**
     * the unit weight we will visualize the car data
     */
    private static int unitPointWeight = 3;

    /**
     * an array of car manufacturer name
     */
    private static String[] manufacturer = {"bmw", "ford", "honda", "mercedes", "toyota"};

    /**
     * the weight span for the scatter plot
     */
    private static int[] carWeight = {1000, 2000, 3000, 4000, 5000};

    /**
     * x coordinate of the scatter plot
     */
    private static int chartX = 100;

    /**
     * y coordinate of the scatter plot
     */
    private static int chartY = 50;

    /**
     * width of the scatter plot
     */
    private static int chartWidth = 750;

    /**
     * height of the scatter plot
     */
    private static int chartHeight = 600;

    /**
     * Default constructor
     */
    public ScatteredCarPlot() {

    }

    /**
     * paint method from JPanel
     *
     * @param g Graphics object
     */
    public void paint(Graphics g) {
        Graphics2D g2 = (Graphics2D) g;
        this.drawChart(g2);
        this.drawCarPoints(g2);
        this.drawLegend(g2);
    }

    /**
     * Draw the skeleton of the chart
     *
     * @param g2 Graphics2D object we used to visualize data
     */
    private void drawChart(Graphics2D g2) {
        // set the back ground of char to grey
        g2.setColor(Color.lightGray);
        // chart's properties
        g2.fillRect(chartX, chartY, chartWidth, chartHeight);
        // set string color to black
        g2.setColor(Color.BLACK);
        g2.drawString("MPG", chartX / 3, chartY + chartHeight / 2);
        g2.drawString("Weight", chartX + chartWidth / 2, chartY + chartHeight + 30);

        // draw the grid
        Color girdColor = new Color(255, 255, 255, 125);
        for (int i = 1; i < 5; i++) {
            // first x-axis direction
            g2.setColor(girdColor);
            g2.drawLine(chartX, 150 * i, chartX + chartWidth, 150 * i);
            g2.setColor(Color.BLACK);
            g2.drawString(String.valueOf((5 - i) * 10), chartX - 30, 150 * i);
            // y-axis direction
            g2.setColor(girdColor);
            g2.drawLine(200 * i, 50, 200 * i, 650);
            g2.setColor(Color.BLACK);
            g2.drawString(String.valueOf(1000 * (i + 1)), 200 * i, chartY + chartHeight + 20);
        }
    }

    /**
     * Draw all of the car points
     *
     * @param g2 Graphics2D object we used to visualize data
     */
    private void drawCarPoints(Graphics2D g2) {
        List<CarPoint> carPoints = CarPoint.getCarPoints();
        for (CarPoint carPoint : carPoints) {
            g2.setColor(this.getManufacturerColor(carPoint.getManufacturer()));
            g2.fillOval((carPoint.getWeight() / 5 - 200), (50 - Math.round(carPoint.getMpg())) * 15, this.getPointWeight(carPoint.getWeight()), this.getPointWeight(carPoint.getWeight()));
        }
    }

    /**
     * Draw the legend
     *
     * @param g2 Graphics2D object we used to visualize data
     */
    private void drawLegend(Graphics2D g2) {
        g2.setColor(Color.BLACK);
        // x coordinate of both legends
        int legendX = chartX + chartWidth + 50;
        // y coordinate of the manufacturer legend
        int legendManufacturer = 100;
        g2.drawString("Manufacturer", legendX, legendManufacturer);
        for (int i = 0; i < manufacturer.length; i++) {
            g2.setColor(this.getManufacturerColor(manufacturer[i]));
            g2.fillOval(legendX, legendManufacturer + (i + 1) * 20, 5, 5);
            g2.setColor(Color.BLACK);
            g2.drawString(manufacturer[i], legendX + 20, legendManufacturer + (i + 1) * 20 + 6);
        }
        // y coordinate of the weight legend
        int legendWeight = 300;
        g2.drawString("Weight", legendX, legendWeight);
        for (int i = 0; i < carWeight.length; i++) {
            g2.setColor(Color.GRAY);
            g2.fillOval(legendX, legendWeight + 30 + i * 30, this.getPointWeight(carWeight[i]), this.getPointWeight(carWeight[i]));
            g2.setColor(Color.BLACK);
            g2.drawString(String.valueOf(carWeight[i]), legendX + 30, legendWeight + 40 + i * 30);
        }
    }

    /**
     * Get the point color on the chart of respective manufacturer
     *
     * @param manufacturerName manufacturer name
     * @return the color of the manufacturer
     */
    private Color getManufacturerColor(String manufacturerName) {
        if (manufacturerName.equals("bmw")) {
            return new Color(180, 0, 170, 125);
        } else if (manufacturerName.equals("ford")) {
            return new Color(0, 200, 200, 125);
        } else if (manufacturerName.equals("honda")) {
            return new Color(255, 200, 0, 125);
        } else if (manufacturerName.equals("mercedes")) {
            return new Color(0, 60, 180, 125);
        } else if (manufacturerName.equals("toyota")) {
            return new Color(255, 0, 0, 125);
        } else {
            return new Color(0, 0, 0, 125);
        }
    }

    /**
     * The weight or the radius of the point of a respective manufacturer
     *
     * @param weight the weight from raw data
     * @return the weight we will use to visualize data
     */
    private int getPointWeight(int weight) {
        if (weight <= 2000) {
            return unitPointWeight * 2;
        } else if (weight <= 3000) {
            return unitPointWeight * 3;
        } else if (weight <= 4000) {
            return unitPointWeight * 4;
        } else {
            return unitPointWeight * 5;
        }
    }
}

/**
 * A class contains all of the car information read from csv file
 */
class CarPoint {
    private String manufacturer;
    private float mpg;
    private int weight;
    private static String fileDirectory = "cars-sample.csv";

    /**
     * Default Constructor
     */
    public CarPoint() {

    }

    /**
     * Constructor to build a car point
     *
     * @param manufacturer
     * @param mpg
     * @param weight
     */
    public CarPoint(String manufacturer, float mpg, int weight) {
        this.manufacturer = manufacturer;
        this.mpg = mpg;
        this.weight = weight;
    }

    /**
     * Read car data from a csv file and put them into a CarPoint ArrayList
     *
     * @return an Array List with all of the car data
     */
    public static List<CarPoint> getCarPoints() {
        List<CarPoint> carPoints = new ArrayList<>();
        try {
            // skip first line which is title
            FileReader fr = new FileReader(CarPoint.fileDirectory);
            BufferedReader br = new BufferedReader(fr);
            try {
                br.readLine();
                // read data to an ArrayList
                String carData = null;
                while ((carData = br.readLine()) != null && carData.length() != 0) {
                    String carProperties[] = carData.split(",");
                    if (carProperties.length != 11 || carProperties[3].equals("NA")) {
                        continue;
                    }
                    String manufacturerName = getManufacturerName(carProperties[2]);
                    float mpg = Float.parseFloat(carProperties[3]);
                    int weight = Integer.parseInt(carProperties[7]);
                    CarPoint carPoint = new CarPoint(manufacturerName, mpg, weight);
                    carPoints.add(carPoint);
                }
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                fr.close();
                br.close();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return carPoints;
    }

    /**
     * Getter
     *
     * @return manufacturer name
     */
    public String getManufacturer() {
        return this.manufacturer;
    }

    /**
     * Getter
     *
     * @return mpg of a car
     */
    public float getMpg() {
        return this.mpg;
    }

    /**
     * Getter
     *
     * @return wight of a car
     */
    public int getWeight() {
        return this.weight;
    }

    /**
     * Get the directory of the input data
     *
     * @return the input data file directory
     */
    public static String getFileDirectory() {
        return fileDirectory;
    }

    /**
     * The manufacturer name we got from raw data has extra quotes,
     * strip them there
     *
     * @param manufacturerName manufacturer name got from raw data
     * @return processed manufacturer name
     */
    private static String getManufacturerName(String manufacturerName) {
        StringBuilder newManufacturerName = new StringBuilder();
        for (int i = 1; i < manufacturerName.length() - 1; i++) {
            newManufacturerName.append(manufacturerName.charAt(i));
        }
        return newManufacturerName.toString();
    }
}