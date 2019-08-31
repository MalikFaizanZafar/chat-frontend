import { Component, ViewChild, OnInit, NgZone } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { auth } from "firebase/app";
import { Router } from "@angular/router";
import * as d3 from "d3";
import { AngularFireDatabase } from "@angular/fire/database";
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  public users: number = 0;
  public showChatBox: boolean = true;

  @ViewChild("msgRef", {static: false}) msgRef;
  constructor(
    public afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private router: Router,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    // this.drawHeatMap();
    // this.drawSunburstDiagram();
    // this.drawScatterBubble();
    // this.drawPieChart();
    // this.drawPieChartTwo();
    // this.drawArcDiagram();
  }

  signInWithGoogle() {
    this.afAuth.auth
      .signInWithPopup(new auth.GoogleAuthProvider())
      .then(result => {
        let user = {
          id: "",
          socialId: result.additionalUserInfo.profile["id"],
          password: "12345",
          token: result.credential["accessToken"],
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
          gender: "",
          birthday: ""
        };
        this.db.database
          .ref("users")
          .push(user)
          .then(data => {
            // console.log("data is : ", data.key);
            user.id = data.key;
            localStorage.setItem("chat-user", JSON.stringify(user));
            this.ngZone.run(() => this.router.navigate(["chat"]));
          });
      });
  }

  drawHeatMap() {
    "use strict";

    var csvDataString =
      "day,hour,value\n\
1,1,16\n\
1,2,20\n\
1,3,0\n\
1,4,0\n\
1,5,0\n\
1,6,2\n\
1,7,0\n\
1,8,9\n\
1,9,25\n\
1,10,49\n\
1,11,57\n\
1,12,61\n\
1,13,37\n\
1,14,66\n\
1,15,70\n\
1,16,55\n\
1,17,51\n\
1,18,55\n\
1,19,17\n\
1,20,20\n\
1,21,9\n\
1,22,4\n\
1,23,0\n\
1,24,12\n\
2,1,6\n\
2,2,2\n\
2,3,0\n\
2,4,0\n\
2,5,0\n\
2,6,2\n\
2,7,4\n\
2,8,11\n\
2,9,28\n\
2,10,49\n\
2,11,51\n\
2,12,47\n\
2,13,38\n\
2,14,65\n\
2,15,60\n\
2,16,50\n\
2,17,65\n\
2,18,50\n\
2,19,22\n\
2,20,11\n\
2,21,12\n\
2,22,9\n\
2,23,0\n\
2,24,13\n\
3,1,5\n\
3,2,8\n\
3,3,8\n\
3,4,0\n\
3,5,0\n\
3,6,2\n\
3,7,5\n\
3,8,12\n\
3,9,34\n\
3,10,43\n\
3,11,54\n\
3,12,44\n\
3,13,40\n\
3,14,48\n\
3,15,54\n\
3,16,59\n\
3,17,60\n\
3,18,51\n\
3,19,21\n\
3,20,16\n\
3,21,9\n\
3,22,5\n\
3,23,4\n\
3,24,7\n\
4,1,0\n\
4,2,0\n\
4,3,0\n\
4,4,0\n\
4,5,0\n\
4,6,2\n\
4,7,4\n\
4,8,13\n\
4,9,26\n\
4,10,58\n\
4,11,61\n\
4,12,59\n\
4,13,53\n\
4,14,54\n\
4,15,64\n\
4,16,55\n\
4,17,52\n\
4,18,53\n\
4,19,18\n\
4,20,3\n\
4,21,9\n\
4,22,12\n\
4,23,2\n\
4,24,8\n\
5,1,2\n\
5,2,0\n\
5,3,8\n\
5,4,2\n\
5,5,0\n\
5,6,2\n\
5,7,4\n\
5,8,14\n\
5,9,31\n\
5,10,48\n\
5,11,46\n\
5,12,50\n\
5,13,66\n\
5,14,54\n\
5,15,56\n\
5,16,67\n\
5,17,54\n\
5,18,23\n\
5,19,14\n\
5,20,6\n\
5,21,8\n\
5,22,7\n\
5,23,0\n\
5,24,8\n\
6,1,2\n\
6,2,0\n\
6,3,2\n\
6,4,0\n\
6,5,0\n\
6,6,0\n\
6,7,4\n\
6,8,8\n\
6,9,8\n\
6,10,6\n\
6,11,14\n\
6,12,12\n\
6,13,9\n\
6,14,14\n\
6,15,0\n\
6,16,4\n\
6,17,7\n\
6,18,6\n\
6,19,0\n\
6,20,0\n\
6,21,0\n\
6,22,0\n\
6,23,0\n\
6,24,0\n\
7,1,7\n\
7,2,6\n\
7,3,0\n\
7,4,0\n\
7,5,0\n\
7,6,0\n\
7,7,0\n\
7,8,0\n\
7,9,0\n\
7,10,0\n\
7,11,2\n\
7,12,2\n\
7,13,5\n\
7,14,6\n\
7,15,0\n\
7,16,4\n\
7,17,0\n\
7,18,2\n\
7,19,10\n\
7,20,7\n\
7,21,0\n\
7,22,19\n\
7,23,9\n\
7,24,4";

    var margin = { top: 50, right: 0, bottom: 100, left: 150 },
      width = 1600 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom,
      gridSize = Math.floor(width / 24),
      legendElementWidth = gridSize * 2,
      buckets = 9,
      colors = [
        "#ffffd9",
        "#edf8b1",
        "#c7e9b4",
        "#7fcdbb",
        "#41b6c4",
        "#1d91c0",
        "#225ea8",
        "#253494",
        "#081d58"
      ], // alternatively colorbrewer.YlGnBu[9]
      //days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
      days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
      //times = ["1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12a", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p", "12p"];
      times = [
        "00:00",
        "01:00",
        "02:00",
        "03:00",
        "04:00",
        "05:00",
        "06:00",
        "07:00",
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
        "21:00",
        "22:00",
        "23:00"
      ];

    var data1 = d3.csvParse(csvDataString);

    var dataArray = d3.csvParse(csvDataString, function(d) {
      return {
        day: +d.day,
        hour: +d.hour,
        value: +d.value
      };
    });

    var dataHandler = function(error, data) {
      var colorScale = d3
        .scaleSequential()
        .domain([0, 100])
        .interpolator(d3.interpolateRainbow);

      var svg = d3
        .select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var dayLabels = svg
        .selectAll(".dayLabel")
        .data(days)
        .enter()
        .append("text")
        .text(function(d) {
          return d;
        })
        .attr("x", 0)
        .attr("y", function(d, i) {
          return i * gridSize;
        })
        .style("text-anchor", "end")
        .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
        .attr("class", function(d, i) {
          return i >= 0 && i <= 4
            ? "dayLabel mono axis axis-workweek"
            : "dayLabel mono axis";
        });

      var timeLabels = svg
        .selectAll(".timeLabel")
        .data(times)
        .enter()
        .append("text")
        .text(function(d) {
          return d;
        })
        .attr("x", function(d, i) {
          return i * gridSize;
        })
        .attr("y", 0)
        .style("text-anchor", "middle")
        .attr("transform", "translate(" + gridSize / 2 + ", -6)")
        .attr("class", function(d, i) {
          return i >= 7 && i <= 16
            ? "timeLabel mono axis axis-worktime"
            : "timeLabel mono axis";
        });

      var heatMap = svg
        .selectAll(".hour")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function(d) {
          return (d.hour - 1) * gridSize;
        })
        .attr("y", function(d) {
          return (d.day - 1) * gridSize;
        })
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("class", "hour bordered")
        .attr("width", gridSize)
        .attr("height", gridSize)
        .style("fill", colors[0]);

      heatMap
        .transition()
        .duration(3000)
        .style("fill", function(d) {
          return colorScale(d.value);
        });

      heatMap.append("title").text(function(d) {
        return d.value;
      });

      //   var legend = svg
      //     .selectAll(".legend")
      //     .data([0].concat(colorScale.quantiles()), function(d) {
      //       return d;
      //     })
      //     .enter()
      //     .append("g")
      //     .attr("class", "legend");

      //   legend
      //     .append("rect")
      //     .attr("x", function(d, i) {
      //       return legendElementWidth * i;
      //     })
      //     .attr("y", height)
      //     .attr("width", legendElementWidth)
      //     .attr("height", gridSize / 2)
      //     .style("fill", function(d, i) {
      //       return colors[i];
      //     });

      //   legend
      //     .append("text")
      //     .attr("class", "mono")
      //     .text(function(d) {
      //       return "= " + Math.round(d);
      //     })
      //     .attr("x", function(d, i) {
      //       return legendElementWidth * i;
      //     })
      //     .attr("y", height + gridSize);
    };

    dataHandler(null, dataArray);
  }

  drawSunburstDiagram() {
    const width = window.innerWidth,
      height = window.innerHeight,
      maxRadius = Math.min(width, height) / 2 - 5;

    const formatNumber = d3.format(",d");

    const x = d3
      .scaleLinear()
      .range([0, 2 * Math.PI])
      .clamp(true);

    const y = d3.scaleSqrt().range([maxRadius * 0.1, maxRadius]);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const partition = d3.partition();

    const arc = d3
      .arc()
      .startAngle(d => x(d.x0))
      .endAngle(d => x(d.x1))
      .innerRadius(d => Math.max(0, y(d.y0)))
      .outerRadius(d => Math.max(0, y(d.y1)));

    const middleArcLine = d => {
      const halfPi = Math.PI / 2;
      const angles = [x(d.x0) - halfPi, x(d.x1) - halfPi];
      const r = Math.max(0, (y(d.y0) + y(d.y1)) / 2);

      const middleAngle = (angles[1] + angles[0]) / 2;
      const invertDirection = middleAngle > 0 && middleAngle < Math.PI; // On lower quadrants write text ccw
      if (invertDirection) {
        angles.reverse();
      }

      const path = d3.path();
      path.arc(0, 0, r, angles[0], angles[1], invertDirection);
      return path.toString();
    };

    const textFits = d => {
      const CHAR_SPACE = 6;

      const deltaAngle = x(d.x1) - x(d.x0);
      const r = Math.max(0, (y(d.y0) + y(d.y1)) / 2);
      const perimeter = r * deltaAngle;

      return d.data.name.length * CHAR_SPACE < perimeter;
    };

    const svg = d3
      .select("#sunburst")
      .append("svg")
      .style("width", "100vw")
      .style("height", "100vh")
      .attr("viewBox", `${-width / 2} ${-height / 2} ${width} ${height}`)
      .on("click", () => focusOn()); // Reset zoom on canvas click

    d3.json(
      "https://gist.githubusercontent.com/mbostock/4348373/raw/85f18ac90409caa5529b32156aa6e71cf985263f/flare.json",
      (error, root) => {
        if (error) throw error;

        root = d3.hierarchy(root);
        root.sum(d => d.size);

        const slice = svg
          .selectAll("g.slice")
          .data(partition(root).descendants());

        slice.exit().remove();

        const newSlice = slice
          .enter()
          .append("g")
          .attr("class", "slice")
          .on("click", d => {
            d3.event.stopPropagation();
            focusOn(d);
          });

        newSlice
          .append("title")
          .text(d => d.data.name + "\n" + formatNumber(d.value));

        newSlice
          .append("path")
          .attr("class", "main-arc")
          .style("fill", d => color((d.children ? d : d.parent).data.name))
          .attr("d", arc);

        newSlice
          .append("path")
          .attr("class", "hidden-arc")
          .attr("id", (_, i) => `hiddenArc${i}`)
          .attr("d", middleArcLine);

        const text = newSlice
          .append("text")
          .attr("display", d => (textFits(d) ? null : "none"));

        // Add white contour
        text
          .append("textPath")
          .attr("startOffset", "50%")
          .attr("xlink:href", (_, i) => `#hiddenArc${i}`)
          .text(d => d.data.name)
          .style("fill", "none")
          .style("stroke", "#fff")
          .style("stroke-width", 5)
          .style("stroke-linejoin", "round");

        text
          .append("textPath")
          .attr("startOffset", "50%")
          .attr("xlink:href", (_, i) => `#hiddenArc${i}`)
          .text(d => d.data.name);
      }
    );

    function focusOn(d = { x0: 0, x1: 1, y0: 0, y1: 1 }) {
      // Reset to top-level if no data point specified

      const transition = svg
        .transition()
        .duration(750)
        .tween("scale", () => {
          const xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
            yd = d3.interpolate(y.domain(), [d.y0, 1]);
          return t => {
            x.domain(xd(t));
            y.domain(yd(t));
          };
        });

      transition.selectAll("path.main-arc").attrTween("d", d => () => arc(d));

      transition
        .selectAll("path.hidden-arc")
        .attrTween("d", d => () => middleArcLine(d));

      transition
        .selectAll("text")
        .attrTween("display", d => () => (textFits(d) ? null : "none"));

      moveStackToFront(d);

      //

      function moveStackToFront(elD) {
        svg
          .selectAll(".slice")
          .filter(d => d === elD)
          .each(function(d) {
            this.parentNode.appendChild(this);
            if (d.parent) {
              moveStackToFront(d.parent);
            }
          });
      }
    }
  }

  drawScatterBubble() {
    var margin = { top: 10, right: 30, bottom: 40, left: 50 },
      width = 520 - margin.left - margin.right,
      height = 520 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3
      .select("#scatter")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add the grey background that makes ggplot2 famous
    svg
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("height", height)
      .attr("width", height)
      .style("fill", "EBEBEB");

    //Read the data
    d3.csv(
      "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv",
      function(data) {
        // Add X axis
        var x = d3
          .scaleLinear()
          .domain([4 * 0.95, 8 * 1.001])
          .range([0, width]);
        svg
          .append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(
            d3
              .axisBottom(x)
              .tickSize(-height * 1.3)
              .ticks(10)
          )
          .select(".domain")
          .remove();

        // Add Y axis
        var y = d3
          .scaleLinear()
          .domain([-0.001, 9 * 1.01])
          .range([height, 0])
          .nice();
        svg
          .append("g")
          .call(
            d3
              .axisLeft(y)
              .tickSize(-width * 1.3)
              .ticks(7)
          )
          .select(".domain")
          .remove();

        // Customization
        svg.selectAll(".tick line").attr("stroke", "white");

        // Add X axis label:
        svg
          .append("text")
          .attr("text-anchor", "end")
          .attr("x", width / 2 + margin.left)
          .attr("y", height + margin.top + 20)
          .text("Sepal Length");

        // Y axis label:
        svg
          .append("text")
          .attr("text-anchor", "end")
          .attr("transform", "rotate(-90)")
          .attr("y", -margin.left + 20)
          .attr("x", -margin.top - height / 2 + 20)
          .text("Petal Length");

        // Color scale: give me a specie name, I return a color
        var color = d3
          .scaleOrdinal()
          .domain(["setosa", "versicolor", "virginica"])
          .range(["#F8766D", "#00BA38", "#619CFF"]);

        // Add dots
        svg
          .append("g")
          .selectAll("dot")
          .data(data)
          .enter()
          .append("circle")
          .attr("cx", function(d) {
            return x(d.Sepal_Length);
          })
          .attr("cy", function(d) {
            return y(d.Petal_Length);
          })
          .attr("r", function(d) {
            console.log("d is : ", d);
            return parseFloat(d.Sepal_Length);
          })
          .style("fill", function(d) {
            return color(d.Species);
          });
      }
    );
  }

  drawPieChart() {
    var width = 300,
      height = 300,
      radius = Math.min(width, height) / 2;

    var color = d3.scaleOrdinal().range(["#6fc9e1", "#00627d", "#179bbf"]);

    var biggestarc = d3
      .arc()
      .outerRadius(radius - 100)
      .innerRadius(radius - 60);

    var bigarc = d3
      .arc()
      .outerRadius(radius - 100)
      .innerRadius(radius - 60);

    var smallarc = d3
      .arc()
      .outerRadius(radius - 100)
      .innerRadius(radius - 60);

    /*var biggerarc = d3.svg.arc()
    .outerRadius(radius - 80)
    .innerRadius(radius - 70);*/

    var pie = d3
      .pie()
      .sort(null)

      .value(function(d) {
        return d.percent;
      });

    var svg = d3
      .select("#pie")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var data = [
      {
        label: "Biggest",
        percent: 33
      },
      {
        label: "Big",
        percent: 17
      },
      {
        label: "Small",
        percent: 50
      }
    ];

    var piedata = pie(data);

    var g = svg
      .selectAll(".arc")
      .data(piedata)
      .enter()
      .append("g")
      .attr("class", "arc");

    g.append("path")
      .attr("d", function(d) {
        if (d.data.label == "Biggest") {
          return biggestarc(d);
        } else if (d.data.label == "Big") {
          return bigarc(d);
        } else {
          return smallarc(d);
        }
      })
      .style("fill", function(d) {
        return color(d.data.label);
      });

    g.append("text") //add a label to each slice
      .attr("transform", function(d) {
        //set the label's origin to the center of the arc
        d.innerRadius = 0;
        d.outerRadius = radius;
        if (d.data.label == "Biggest") {
          return "translate(" + biggestarc.centroid(d) + ")";
        } else if (d.data.label == "Big") {
          return "translate(" + bigarc.centroid(d) + ")";
        } else {
          return "translate(" + smallarc.centroid(d) + ")";
        }
      })
      .attr("text-anchor", "middle")
      .text(function(d, i) {
        return data[i].percent + "%";
      });

    var labels = g.append("g").classed("labels", true);

    labels
      .selectAll("text")
      .data(piedata)
      .enter()
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", function(d) {
        var a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
        d.cx = Math.cos(a) * (radius - 75);
        return (d.x = Math.cos(a) * (radius - 20));
      })
      .attr("y", function(d) {
        var a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
        d.cy = Math.sin(a) * (radius - 75);
        return (d.y = Math.sin(a) * (radius - 20));
      })
      .text(function(d) {
        return d.data.label;
      })
      .each(function(d) {
        var bbox = this.getBBox();
        d.sx = d.x - bbox.width / 2 - 2;
        d.ox = d.x + bbox.width / 2 + 2;
        d.sy = d.oy = d.y + 5;
      });

    /* labels.append("defs").append("marker")
    .attr("id", "circ")
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("refX", 3)
    .attr("refY", 3)
    .append("circle")
    .attr("cx", 3)
    .attr("cy", 3)
    .attr("r", 3); */

    labels
      .selectAll("path.pointer")
      .data(piedata)
      .enter()
      .append("path")
      .attr("class", "pointer")
      .style("fill", "none")
      .style("stroke", "black")
      .attr("marker-end", "url(#circ)")
      .attr("d", function(d) {
        if (d.cx > d.ox) {
          return (
            "M" +
            d.sx +
            "," +
            d.sy +
            "L" +
            d.ox +
            "," +
            d.oy +
            " " +
            d.cx +
            "," +
            d.cy
          );
        } else {
          return (
            "M" +
            d.ox +
            "," +
            d.oy +
            "L" +
            d.sx +
            "," +
            d.sy +
            " " +
            d.cx +
            "," +
            d.cy
          );
        }
      });
  }

  drawPieChartTwo() {
    const width = 450;
    const height = 450;
    const margin = 40;

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    var radius = Math.min(width, height) / 2 - margin;

    // append the svg object to the div called 'my_dataviz'
    var svg = d3
      .select("#pietwo")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // Create dummy data
    var data = { a: 9, b: 20, c: 30, d: 8, e: 12 };

    // set the color scale
    var color = d3
      .scaleOrdinal()
      .domain(data)
      .range(["#ff0000", "#00ff00", "#0000ff", "#d3d3d3", "#f5f5f5"]);

    // Compute the position of each group on the pie:
    var pie = d3.pie().value(function(d) {
      return d.value;
    });
    var data_ready = pie(d3.entries(data));
    // Now I know that group A goes from 0 degrees to x degrees and so on.

    // shape helper to build arcs:
    var arcGenerator = d3
      .arc()
      .innerRadius(0)
      .outerRadius(radius);

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg
      .selectAll("mySlices")
      .data(data_ready)
      .enter()
      .append("path")
      .attr("id", function(d, i) {
        return "arc_" + i;
      })
      .attr("d", arcGenerator)
      .attr("fill", function(d) {
        return color(d.data.key);
      })
      .attr("stroke", "black")
      .style("stroke-width", "2px")
      .style("opacity", 0.7);

    // Now add the annotation. Use the centroid method to get the best coordinates
    svg
      .selectAll("mySlices")
      .data(data_ready)
      .enter()
      .append("text")
      .attr("x", function(d) {
        return d.data.value * 10;
      }) //Move the text from the start angle of the arc
      .attr("dy", 18) //Move the text down
      .append("textPath")
      .attr("xlink:href", function(d, i) {
        return "#arc_" + i;
      })
      .text(function(d) {
        return "grp " + d.data.key;
      })
      .attr("transform", function(d) {
        return "translate(" + arcGenerator.centroid(d) + ")";
      })
      .style("text-anchor", "middle")
      .style("font-size", 17);
  }

  drawArcDiagram() {
    var margin = { top: 0, right: 30, bottom: 50, left: 10 },
      width = 1370 - margin.left - margin.right,
      height = 695 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3
      .select("#arc")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Read dummy data
    d3.json(
      "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_researcherNetwork.json",
      function(data) {
        // List of node names
        var allNodes = data.nodes.map(function(d) {
          return d.name;
        });

        // List of groups
        var allGroups = data.nodes.map(function(d) {
          return d.grp;
        });
        allGroups = new Set(allGroups);

        // A color scale for groups:
        var color = d3
          .scaleOrdinal()
          .domain(allGroups)
          .range(["#ff0000", "#00ff00", "#0000ff", "#d3d3d3", "#000000", "#F4D03F", "#F43FE9", "#F49A3F", "##3FF4D3", "##3FA2F4", "#F45D3F", "#CE3FF4"]);

        // A linear scale for node size
        var size = d3
          .scaleLinear()
          .domain([1, 10])
          .range([2, 10]);

        // A linear scale to position the nodes on the X axis
        var x = d3
          .scalePoint()
          .range([0, width])
          .domain(allNodes);

        // In my input data, links are provided between nodes -id-, NOT between node names.
        // So I have to do a link between this id and the name
        var idToNode = {};
        data.nodes.forEach(function(n) {
          idToNode[n.id] = n;
        });

        // Add the links
        var links = svg
          .selectAll("mylinks")
          .data(data.links)
          .enter()
          .append("path")
          .attr("d", function(d) {
           let start = x(idToNode[d.source].name); // X position of start node on the X axis
           let end = x(idToNode[d.target].name); // X position of end node
            return [
              "M",
              start,
              height - 30, // the arc starts at the coordinate x=start, y=height-30 (where the starting node is)
              "A", // This means we're gonna build an elliptical arc
              (start - end) / 2,
              ",", // Next 2 lines are the coordinates of the inflexion point. Height of this point is proportional with start - end distance
              (start - end) / 2,
              0,
              0,
              ",",
              start < end ? 1 : 0,
              end,
              ",",
              height - 30
            ] // We always want the arc on top. So if end is before start, putting 0 here turn the arc upside down.
              .join(" ");
          })
          .style("fill", "none")
          .attr("stroke", "grey")
          .style("stroke-width", 1);

        // Add the circle for the nodes
        var nodes = svg
          .selectAll("mynodes")
          .data(
            data.nodes.sort(function(a, b) {
              return +b.n - +a.n;
            })
          )
          .enter()
          .append("circle")
          .attr("cx", function(d) {
            return x(d.name);
          })
          .attr("cy", height - 30)
          .attr("r", function(d) {
            return size(d.n);
          })
          .style("fill", function(d) {
            return color(d.grp);
          })
          .attr("stroke", "white");

        // And give them a label
        var labels = svg
          .selectAll("mylabels")
          .data(data.nodes)
          .enter()
          .append("text")
          .attr("x", 0)
          .attr("y", 0)
          .text(function(d) {
            return d.name;
          })
          .style("text-anchor", "end")
          .attr("transform", function(d) {
            return (
              "translate(" + x(d.name) + "," + (height - 15) + ")rotate(-45)"
            );
          })
          .style("font-size", 6);

        // Add the highlighting functionality
        nodes
          .on("mouseover", function(d) {
            // Highlight the nodes: every node is green except of him
            nodes.style("opacity", 0.2);
            d3.select(this).style("opacity", 1);
            // Highlight the connections
            links
              .style("stroke", function(link_d) {
                return link_d.source === d.id || link_d.target === d.id
                  ? color(d.grp)
                  : "#b8b8b8";
              })
              .style("stroke-opacity", function(link_d) {
                return link_d.source === d.id || link_d.target === d.id
                  ? 1
                  : 0.2;
              })
              .style("stroke-width", function(link_d) {
                return link_d.source === d.id || link_d.target === d.id ? 4 : 1;
              });
            labels
              .style("font-size", function(label_d) {
                return label_d.name === d.name ? 16 : 2;
              })
              .attr("y", function(label_d) {
                return label_d.name === d.name ? 10 : 0;
              });
          })
          .on("mouseout", function(d) {
            nodes.style("opacity", 1);
            links
              .style("stroke", "grey")
              .style("stroke-opacity", 0.8)
              .style("stroke-width", "1");
            labels.style("font-size", 6);
          });
      }
    );
  }
}
