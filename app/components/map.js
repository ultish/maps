(function () {
  // Function to calculate a rotation quaternion for rotating from point end to point start around point center.
  function calculateRotationQuaternion(center, end, start) {
    var centerTranslation = center.translate(), // Get the translation of the projection
      angle =
        Math.atan2(
          end[1] - centerTranslation[1],
          end[0] - centerTranslation[0],
        ) -
        Math.atan2(
          start[1] - centerTranslation[1],
          start[0] - centerTranslation[0],
        ); // Calculate the angle between the two points
    return [Math.cos(angle / 2), 0, 0, Math.sin(angle / 2)]; // Return the quaternion representing the rotation
  }

  // Function to invert a point on the projection and check if it's valid.
  function invertPoint(projection, point) {
    var invertedPoint = projection.invert(point); // Invert the point
    return (
      invertedPoint &&
      isFinite(invertedPoint[0]) &&
      isFinite(invertedPoint[1]) &&
      convertToCartesian(invertedPoint)
    ); // Check if the inverted point is valid and convert it to Cartesian coordinates
  }

  // Function to convert a rotation quaternion to a rotation matrix.
  function quaternionToMatrix(quaternion) {
    var halfX = 0.5 * quaternion[0] * degreesToRadians,
      halfY = 0.5 * quaternion[1] * degreesToRadians,
      halfZ = 0.5 * quaternion[2] * degreesToRadians,
      sinHalfX = Math.sin(halfX),
      cosHalfX = Math.cos(halfX),
      sinHalfY = Math.sin(halfY),
      cosHalfY = Math.cos(halfY),
      sinHalfZ = Math.sin(halfZ),
      cosHalfZ = Math.cos(halfZ);
    return [
      cosHalfX * cosHalfY * cosHalfZ + sinHalfX * sinHalfY * sinHalfZ,
      sinHalfX * cosHalfY * cosHalfZ - cosHalfX * sinHalfY * sinHalfZ,
      cosHalfX * sinHalfY * cosHalfZ + sinHalfX * cosHalfY * sinHalfZ,
      cosHalfX * cosHalfY * sinHalfZ - sinHalfX * sinHalfY * cosHalfZ,
    ]; // Return the rotation matrix
  }

  // Function to multiply two matrices.
  function multiplyMatrices(matrix1, matrix2) {
    var m11 = matrix1[0],
      m12 = matrix1[1],
      m13 = matrix1[2],
      m14 = matrix1[3],
      m21 = matrix2[0],
      m22 = matrix2[1],
      m23 = matrix2[2],
      m24 = matrix2[3];
    return [
      m11 * m21 - m12 * m22 - m13 * m23 - m14 * m24,
      m11 * m22 + m12 * m21 + m13 * m24 - m14 * m23,
      m11 * m23 - m12 * m24 + m13 * m21 + m14 * m22,
      m11 * m24 + m12 * m23 - m13 * m22 + m14 * m21,
    ]; // Return the product of the two matrices
  }

  // Function to calculate a rotation quaternion for rotating from quaternion fromQuaternion to quaternion toQuaternion.
  function calculateRotationQuaternionBetweenQuaternions(
    fromQuaternion,
    toQuaternion,
  ) {
    if (fromQuaternion && toQuaternion) {
      var crossProductResult = crossProduct(fromQuaternion, toQuaternion), // Calculate the cross product of the two quaternions
        magnitude = Math.sqrt(
          dotProduct(crossProductResult, crossProductResult),
        ), // Calculate the magnitude of the cross product
        angle =
          0.5 *
          Math.acos(
            Math.max(-1, Math.min(1, dotProduct(fromQuaternion, toQuaternion))),
          ), // Calculate the angle between the two quaternions
        scaleFactor = Math.sin(angle) / magnitude; // Calculate the scaling factor for the rotation axis
      return (
        magnitude && [
          Math.cos(angle),
          crossProductResult[2] * scaleFactor,
          -crossProductResult[1] * scaleFactor,
          crossProductResult[0] * scaleFactor,
        ]
      ); // Return the quaternion representing the rotation
    }
  }

  // Function to create a function that interpolates between two quaternions fromQuaternion and toQuaternion.
  function createQuaternionInterpolationFunction(fromQuaternion, toQuaternion) {
    var dotProductResult = Math.max(
        -1,
        Math.min(1, dotProduct(fromQuaternion, toQuaternion)),
      ), // Calculate the dot product of the two quaternions
      sign = 0 > dotProductResult ? -1 : 1, // Determine the sign of the angle
      angle = Math.acos(sign * dotProductResult), // Calculate the angle between the two quaternions
      sinAngle = Math.sin(angle); // Calculate the sine of the angle
    return sinAngle
      ? function (t) {
          // Return a function that interpolates between the two quaternions based on the parameter t
          var fromScaleFactor = (sign * Math.sin((1 - t) * angle)) / sinAngle,
            toScaleFactor = Math.sin(t * angle) / sinAngle;
          return [
            fromQuaternion[0] * fromScaleFactor +
              toQuaternion[0] * toScaleFactor,
            fromQuaternion[1] * fromScaleFactor +
              toQuaternion[1] * toScaleFactor,
            fromQuaternion[2] * fromScaleFactor +
              toQuaternion[2] * toScaleFactor,
            fromQuaternion[3] * fromScaleFactor +
              toQuaternion[3] * toScaleFactor,
          ];
        }
      : function () {
          // If the sine of the angle is 0, return a function that returns the first quaternion
          return fromQuaternion;
        };
  }

  // Function to convert a quaternion to Euler angles.
  function quaternionToEulerAngles(quaternion) {
    return [
      Math.atan2(
        2 * (quaternion[0] * quaternion[1] + quaternion[2] * quaternion[3]),
        1 - 2 * (quaternion[1] * quaternion[1] + quaternion[2] * quaternion[2]),
      ) * radiansToDegrees, // Calculate the yaw angle
      Math.asin(
        Math.max(
          -1,
          Math.min(
            1,
            2 * (quaternion[0] * quaternion[2] - quaternion[3] * quaternion[1]),
          ),
        ),
      ) * radiansToDegrees, // Calculate the pitch angle
      Math.atan2(
        2 * (quaternion[0] * quaternion[3] + quaternion[1] * quaternion[2]),
        1 - 2 * (quaternion[2] * quaternion[2] + quaternion[3] * quaternion[3]),
      ) * radiansToDegrees,
    ]; // Calculate the roll angle
  }

  // Function to convert a point from spherical coordinates to Cartesian coordinates.
  function convertToCartesian(point) {
    var longitudeRadians = point[0] * degreesToRadians, // Convert longitude to radians
      latitudeRadians = point[1] * degreesToRadians, // Convert latitude to radians
      cosLatitude = Math.cos(latitudeRadians); // Calculate the cosine of the latitude
    return [
      cosLatitude * Math.cos(longitudeRadians),
      cosLatitude * Math.sin(longitudeRadians),
      Math.sin(latitudeRadians),
    ]; // Return the Cartesian coordinates
  }

  // Function to calculate the dot product of two vectors.
  function dotProduct(vector1, vector2) {
    for (var i = 0, length = vector1.length, result = 0; length > i; ++i)
      result += vector1[i] * vector2[i];
    return result;
  }

  // Function to calculate the cross product of two vectors.
  function crossProduct(vector1, vector2) {
    return [
      vector1[1] * vector2[2] - vector1[2] * vector2[1],
      vector1[2] * vector2[0] - vector1[0] * vector2[2],
      vector1[0] * vector2[1] - vector1[1] * vector2[0],
    ];
  }

  // Function to create a custom event dispatcher.
  function createEventDispatcher(target) {
    for (var i = 0, length = arguments.length, eventTypes = []; ++i < length; )
      eventTypes.push(arguments[i]);
    var dispatcher = d3.dispatch.apply(null, eventTypes); // Create a new D3 dispatcher
    return (
      (dispatcher.of = function (context, args) {
        // Define the "of" method for the dispatcher
        return function (event) {
          // Return a function that handles the event
          try {
            var originalEvent = (event.sourceEvent = d3.event); // Store the original D3 event
            (event.target = target), // Set the target of the event to the provided object
              (d3.event = event), // Set the current D3 event to the custom event
              dispatcher[event.type].apply(context, args); // Call the corresponding event handler on the dispatcher
          } finally {
            d3.event = originalEvent; // Restore the original D3 event
          }
        };
      }),
      dispatcher
    ); // Return the custom dispatcher
  }

  var degreesToRadians = Math.PI / 180, // Constant for converting degrees to radians
    radiansToDegrees = 180 / Math.PI; // Constant for converting radians to degrees

  // Define the d3.geo.zoom function.

  d3.geo.zoom = function () {
    // Function to handle zoom start events.
    function handleZoomStart(event) {
      zoomLevel++ ||
        event({
          // Increment the zoom level and dispatch a "zoomstart" event if the zoom level is 1
          type: 'zoomstart',
        });
    }

    // Function to handle zoom events.
    function handleZoom(event) {
      event({
        // Dispatch a "zoom" event
        type: 'zoom',
      });
    }

    // Function to handle zoom end events.
    function handleZoomEnd(event) {
      --zoomLevel ||
        event({
          // Decrement the zoom level and dispatch a "zoomend" event if the zoom level is 0
          type: 'zoomend',
        });
    }

    var projection, // Variable to store the projection
      zoomDuration, // Variable to store the duration of zoom transitions
      zoomLevel = 0, // Variable to track the current zoom level
      zoomDispatcher = createEventDispatcher(
        this,
        'zoomstart',
        'zoom',
        'zoomend',
      ), // Create a dispatcher for zoom events
      zoomBehavior = d3.behavior
        .zoom()
        .on('zoomstart', function () {
          // Create a D3 zoom behavior
          var mousePosition = d3.mouse(this), // Get the current mouse position
            currentRotationMatrix = quaternionToMatrix(projection.rotate()), // Get the current rotation matrix
            invertedMousePosition = invertPoint(projection, mousePosition); // Invert the mouse position to get the corresponding point on the globe
          invertedMousePosition && (previousPoint = invertedMousePosition), // If the inverted point is valid, store it as the previous point
            zoomBehavior.on('zoom', function () {
              // Set the zoom handler for the D3 zoom behavior
              projection.scale((zoomParameters.k = d3.event.scale)); // Update the scale of the projection
              var newMousePosition = d3.mouse(this), // Get the current mouse position
                rotationQuaternion =
                  calculateRotationQuaternionBetweenQuaternions(
                    previousPoint,
                    invertPoint(projection, newMousePosition),
                  ); // Calculate the rotation quaternion based on the movement of the mouse
              projection.rotate(
                (zoomParameters.r = quaternionToEulerAngles(
                  (currentRotationMatrix = rotationQuaternion
                    ? multiplyMatrices(
                        currentRotationMatrix,
                        rotationQuaternion,
                      )
                    : multiplyMatrices(
                        calculateRotationQuaternion(
                          projection,
                          mousePosition,
                          newMousePosition,
                        ),
                        currentRotationMatrix,
                      )),
                )),
              ), // Update the rotation of the projection
                (mousePosition = newMousePosition), // Update the previous mouse position
                handleZoom(zoomDispatcher.of(this, arguments)); // Dispatch a "zoom" event
            }),
            handleZoomStart(zoomDispatcher.of(this, arguments)); // Dispatch a "zoomstart" event
        })
        .on('zoomend', function () {
          // Set the zoom end handler for the D3 zoom behavior
          zoomBehavior.on('zoom', null), // Clear the zoom handler
            handleZoomEnd(zoomDispatcher.of(this, arguments)); // Dispatch a "zoomend" event
        }),
      zoomBehaviorOn = zoomBehavior.on, // Store the original "on" method of the D3 zoom behavior
      zoomParameters = {
        // Object to store zoom parameters
        r: [0, 0, 0], // Rotation angles
        k: 1, // Scale factor
      };

    // Define the "rotateTo" method for the zoom behavior.
    zoomBehavior.rotateTo = function (point) {
      var rotationQuaternion = calculateRotationQuaternionBetweenQuaternions(
        convertToCartesian(point),
        convertToCartesian([-zoomParameters.r[0], -zoomParameters.r[1]]),
      ); // Calculate the rotation quaternion
      return quaternionToEulerAngles(
        multiplyMatrices(
          quaternionToMatrix(zoomParameters.r),
          rotationQuaternion,
        ),
      ); // Return the Euler angles representing the rotation
    };

    // Define the "projection" method for the zoom behavior.
    zoomBehavior.projection = function (newProjection) {
      return arguments.length
        ? ((projection = newProjection), // Set the projection
          (zoomParameters = {
            // Update the zoom parameters based on the projection
            r: projection.rotate(), // Rotation angles
            k: projection.scale(), // Scale factor
          }),
          zoomBehavior.scale(zoomParameters.k))
        : projection; // Return the projection
    };

    // Define the "duration" method for the zoom behavior.
    zoomBehavior.duration = function (newDuration) {
      return arguments.length
        ? ((zoomDuration = newDuration), // Set the duration of zoom transitions
          zoomBehavior)
        : zoomDuration; // Return the duration
    };

    // Define the "event" method for the zoom behavior.
    zoomBehavior.event = function (selection) {
      selection.each(function () {
        var element = d3.select(this), // Select the current element
          elementDispatcher = zoomDispatcher.of(this, arguments), // Create a dispatcher for the current element
          previousZoomParameters = zoomParameters, // Store the current zoom parameters
          transition = d3.transition(element); // Create a D3 transition for the current element
        if (transition !== element) {
          // If the current element has a transition
          transition
            .each('start.zoom', function () {
              // Handle the "start.zoom" event
              this.__chart__ && (zoomParameters = this.__chart__), // If the element has a "__chart__" property, update the zoom parameters
                projection.rotate(zoomParameters.r).scale(zoomParameters.k), // Update the projection based on the new zoom parameters
                handleZoomStart(elementDispatcher); // Dispatch a "zoomstart" event
            })
            .tween('zoom:zoom', function () {
              // Define the "zoom:zoom" tween
              var width = zoomBehavior.size()[0], // Get the width of the zoom behavior
                rotationInterpolationFunction =
                  createQuaternionInterpolationFunction(
                    quaternionToMatrix(zoomParameters.r),
                    quaternionToMatrix(previousZoomParameters.r),
                  ), // Create a function to interpolate between the current rotation and the target rotation
                rotationDistance = d3.geo.distance(
                  zoomParameters.r,
                  previousZoomParameters.r,
                ), // Calculate the distance between the current rotation and the target rotation
                zoomInterpolationFunction = d3.interpolateZoom(
                  [0, 0, width / zoomParameters.k],
                  [rotationDistance, 0, width / previousZoomParameters.k],
                ); // Create a function to interpolate between the current zoom level and the target zoom level
              return (
                zoomDuration &&
                  transition.duration(
                    zoomDuration(0.001 * zoomInterpolationFunction.duration),
                  ), // Set the duration of the transition if a duration is specified
                function (t) {
                  // Define the interpolation function
                  var zoomInterpolationResult = zoomInterpolationFunction(t); // Get the interpolated zoom parameters
                  (this.__chart__ = zoomParameters =
                    {
                      r: quaternionToEulerAngles(
                        rotationInterpolationFunction(
                          zoomInterpolationResult[0] / rotationDistance,
                        ),
                      ), // Interpolate the rotation
                      k: width / zoomInterpolationResult[2], // Interpolate the scale
                    }),
                    projection.rotate(zoomParameters.r).scale(zoomParameters.k), // Update the projection based on the interpolated zoom parameters
                    zoomBehavior.scale(zoomParameters.k), // Update the zoom behavior's scale
                    handleZoom(elementDispatcher); // Dispatch a "zoom" event
                }
              );
            })
            .each('end.zoom', function () {
              // Handle the "end.zoom" event
              handleZoomEnd(elementDispatcher); // Dispatch a "zoomend" event
            });
          try {
            transition.each('interrupt.zoom', function () {
              // Handle the "interrupt.zoom" event
              handleZoomEnd(elementDispatcher); // Dispatch a "zoomend" event
            });
          } catch (e) {}
        } else
          (this.__chart__ = zoomParameters), // If the element doesn't have a transition, set its "__chart__" property to the current zoom parameters
            handleZoomStart(elementDispatcher), // Dispatch a "zoomstart" event
            handleZoom(elementDispatcher), // Dispatch a "zoom" event
            handleZoomEnd(elementDispatcher); // Dispatch a "zoomend" event
      });
    };

    d3.rebind(zoomBehavior, zoomDispatcher, 'on'); // Rebind the "on" method of the zoom dispatcher to the zoom behavior
    return zoomBehavior; // Return the zoom behavior
  };
})(),
  (function () {
    // Function to create a context for drawing on a canvas.
    function createContext(canvasContext) {
      return {
        moveTo: function (x, y) {
          canvasContext.moveTo(
            Math.round(x * devicePixelRatio),
            Math.round(y * devicePixelRatio),
          );
        },
        lineTo: function (x, y) {
          canvasContext.lineTo(
            Math.round(x * devicePixelRatio),
            Math.round(y * devicePixelRatio),
          );
        },
        closePath: function () {
          canvasContext.closePath();
        },
      };
    }

    var radiansToDegrees = 180 / Math.PI,
      devicePixelRatio = window.devicePixelRatio || 1,
      width = 960,
      height = 500,
      clipPadding = devicePixelRatio,
      orthographicProjection = d3.geo
        .orthographic()
        .rotate([0, -30])
        .scale(height / 2 - 1)
        .translate([width / 2, height / 2])
        .clipExtent([
          [-clipPadding, -clipPadding],
          [width + clipPadding, height + clipPadding],
        ])
        .precision(0.5),
      canvas = d3
        .select('#map')
        .append('canvas')
        .attr('width', width * devicePixelRatio)
        .attr('height', height * devicePixelRatio)
        .style('width', width + 'px')
        .style('height', height + 'px'),
      canvasContext = canvas.node().getContext('2d'),
      pathGenerator = d3.geo
        .path()
        .projection(orthographicProjection)
        .context(createContext(canvasContext)),
      northUpCheckbox = d3
        .select('#north-up')
        .on('change', function () {
          isNorthUp = this.checked;
        })
        .property('checked'),
      isNorthUp = northUpCheckbox;

    // Load the world map data and create the visualization.
    d3.json('../world-110m.json', function (error, world) {
      // Function to update the projection and draw the map for a specific country.
      function updateProjectionAndDrawMap(projection, country) {
        var centroid = d3.geo.centroid(country),
          clipExtent = projection.clipExtent();
        projection
          .rotate(
            isNorthUp
              ? [-centroid[0], -centroid[1]]
              : zoomBehavior.rotateTo(centroid),
          )
          .clipExtent(null)
          .scale(1)
          .translate([0, 0]);
        var bounds = pathGenerator.bounds(country),
          scaleFactor = Math.min(
            1e3,
            0.45 /
              Math.max(
                Math.max(Math.abs(bounds[1][0]), Math.abs(bounds[0][0])) /
                  width,
                Math.max(Math.abs(bounds[1][1]), Math.abs(bounds[0][1])) /
                  height,
              ),
          );
        projection
          .clipExtent(clipExtent)
          .scale(scaleFactor)
          .translate([width / 2, height / 2]);
      }

      // Function to handle the zoom end event and update the map for the next country.
      function handleZoomEnd() {
        updateProjectionAndDrawMap(
          orthographicProjection,
          countries[
            (currentIndex = ((nextIndex = currentIndex) + 1) % countries.length)
          ],
        ),
          canvas
            .transition()
            .ease('quad-in-out')
            .duration(2e3)
            .call(zoomBehavior.projection(orthographicProjection).event);
      }

      var sphere = {
          type: 'Sphere',
        },
        graticule = d3.geo.graticule()(),
        land = topojson.feature(world, world.objects.land),
        countryBoundaries = topojson.mesh(world, world.objects.countries),
        countries = d3.shuffle(
          topojson.feature(world, world.objects.countries).features,
        ),
        currentIndex = -1,
        nextIndex = currentIndex,
        zoomBehavior = d3.geo
          .zoom()
          .projection(orthographicProjection)
          .duration(function (t) {
            return 2e3 * Math.sqrt(t);
          })
          .scaleExtent([height / 2 - 1, 1 / 0])
          .on('zoom', function () {
            orthographicProjection.clipAngle(
              Math.asin(
                Math.min(
                  1,
                  (0.5 * Math.sqrt(width * width + height * height)) /
                    orthographicProjection.scale(),
                ),
              ) * radiansToDegrees,
            ),
              canvasContext.clearRect(
                0,
                0,
                width * devicePixelRatio,
                height * devicePixelRatio,
              ),
              (canvasContext.strokeStyle = '#999'),
              (canvasContext.lineWidth = 0.25 * devicePixelRatio),
              canvasContext.beginPath(),
              pathGenerator(graticule),
              canvasContext.stroke(),
              (canvasContext.fillStyle = '#69d2e7'),
              canvasContext.beginPath(),
              pathGenerator(land),
              canvasContext.fill(),
              (canvasContext.fillStyle = '#f00'),
              canvasContext.beginPath(),
              pathGenerator(countries[nextIndex]),
              canvasContext.fill(),
              (canvasContext.fillStyle = '#f00'),
              canvasContext.beginPath(),
              pathGenerator(countries[currentIndex]),
              canvasContext.fill(),
              (canvasContext.strokeStyle = '#fff'),
              (canvasContext.lineWidth = 0.5 * devicePixelRatio),
              canvasContext.beginPath(),
              pathGenerator(countryBoundaries),
              canvasContext.stroke(),
              (canvasContext.strokeStyle = '#000'),
              (canvasContext.lineWidth = 0.5 * devicePixelRatio),
              canvasContext.beginPath(),
              pathGenerator(sphere),
              canvasContext.stroke();
          })
          .on('zoomend', handleZoomEnd);

      canvas.call(zoomBehavior).call(zoomBehavior.event);
    });
  })();
