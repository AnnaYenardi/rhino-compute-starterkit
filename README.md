# sample-grasshopper-file

contains cubeVolume.gh > a super basic grasshopper script. Accepts numerical input with input parameter 'EdgeLength'. The grasshopper script builds a cube with the specified edge length, calculates and returns the volume.
this is to be placed within an S3 bucket.

# grasshopper-parser-frontendTestUI 

a very very basic frontend (just a button) to test the rhino compute infrastructure. With the current test input & cubeVolume.gh, it should print the volume of the cube on click.

# lambda-function

contains an index.mjs file.
requires these npm dependencies:
- aws-sdk
- rhino3dm
- compute0rhino3d
