import React from "react";

export default function BoundingStl() {

    function handleinp(props) {
        //Reading the file as a blob when user enters a file.
        const file = props.target.files[0];
        // console.log(file)

        //Storing the raw data as an array buffer (promise based method arrayBuffer())
        let prom = file.arrayBuffer();
        //Resolving the promisie and .then chaining
        Promise.resolve(prom).then(
            (e) => {
                //Store the array buffer as a dataview so it can be parsed and processed.
                let view1 = new DataView(e);

                //Reads total number of triangles
                //Reads one unsigned 32 bit integer (4 bytes), from the 80th byte (right after the header)
                //This will give the number of triangles
                let facets = view1.getUint32(80, true);

                //Reading the first normal vector
                //3 floating 32 bit integers (total of 12 bytes)


                //Start the offset from the first normal vector in the file
                let offset = 84;
                let newOffset;

                //Arrays which will hold each x,y and z value
                let xarr = [];
                let yarr = [];
                let zarr = [];
                let x,y,z;

                //Loop through all the triangles
                for (let i = 0; i < facets; i++) {

                    //Start reading the first triangle verticies (skipped over the normal vector because it is not needed to calculate the bounding box)
                    newOffset = offset + 12;
                    for (let i = 0; i < 3; i++) {

                        x = view1.getFloat32(newOffset, true);
                        y = view1.getFloat32(newOffset + 4, true);
                        z = view1.getFloat32(newOffset + 8, true);

                        xarr.push(x);
                        yarr.push(y);
                        zarr.push(z);

                        //After reading the first triangle, increment the offset to read the next 12 bytes of data (next triangle verticies)
                        newOffset += 12;
                        console.log(`Verticies: ${x} ${y} ${z}`)
                    }

                    console.log(`Triangle ${i + 1}`)

                    //Add 50 bytes to the ORIGINAL offset to get to the next normal vector (reading the next triangle)
                    offset += 50;
                }

                //Simply subract the max and min values in order to get the bounding box in each direction
                let width = Math.max(...xarr) - Math.min(...xarr);
                let height = Math.max(...yarr) - Math.min(...yarr);
                let depth = Math.max(...zarr) - Math.min(...zarr);

                console.log(`The width is ${width}, the height is ${height} and the depth is ${depth}`)

                /*
                NOTE: Bytes 0-79 is the header (first 80 bytes). If I start reading a uint32 from 80, then it will read the next 4 bytes (which contain information about the number of triangles)
                32 bits, 8 bits per byte = 4 bytes

                Then 84 - 95 - Split up into 3 4 byte chunks, each containing a coordinate for the normal of that face. 

                I can keep offsetting by 50 from 84 to get to the next triangle normal.

                */

            }

        )

    }
    return (
        <>
            <input onChange={handleinp} type={"file"}></input>
            <h1> This is the voice</h1>
        </>
    )
}
