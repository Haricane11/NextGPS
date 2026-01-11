'use client'
import * as turf from "@turf/turf";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import busLineData from "../buslinesData.json";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [searchResult, setSearchResult] = useState("");
  const [chooseResult, setChooseResult] = useState(null);
  const [licenseNoInput, setLicenseNoInput] = useState("");
  const [startTracking, setStartTracking] = useState(false);

  const displayBuslines = !searchResult ? busLineData : busLineData.filter(line => line.id === Number(searchResult))

  const handleChoosingBus = (bus) => {
    setChooseResult(bus)
  }

  const handleSubmitBus = async () => {

    const hasConfirm = confirm(`You choose 🚌 bus line : " ${chooseResult.id} " with license number: "${licenseNoInput}" `);
    if (hasConfirm) {


      setStartTracking(true)
    }
  }

  const sendToRedis = async (longitude, latitude) => {
    try {
      const res = await fetch('/api', {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({ member: licenseNoInput, longitude: longitude, latitude: latitude })
      });

      if (!res.ok) {
        const errorText = await res.json();
        alert("Redis Sync Failed:", errorText.error)
      }
    } catch (error) {
      alert("Network error", error)
    } 

  }

  const lastLocation = useRef(null);

  useEffect(() => {
    if (!startTracking || !navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(

      (position) => {

        const { longitude, latitude } = position.coords;
        const newLocation = [longitude, latitude];

        let distance = 0;

        if (lastLocation.current) {
          distance = turf.distance(
            turf.point(lastLocation.current),
            turf.point(newLocation),
            { units: 'meters' }
          )
        }

        if (!lastLocation.current || distance > 3) {
          lastLocation.current = newLocation;
          sendToRedis(longitude, latitude)
        }
      },

      (error) => console.error(error),
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [startTracking]);


  return (
    <div className="flex flex-col min-h-screen items-center  bg-[#F2EDE9]  font-sans p-5 gap-10">
      <h1 className="border border-white bg-white text-black shadow-lg rounded-lg p-5">
        🚌. . . . GPS - Bus Tracking . . . . 🚌
      </h1>
      {/* to choose bus line number  */}
      {!chooseResult && !startTracking &&
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
          <input
            type="search"
            placeholder="Choose your bus line number . . ."
            value={searchResult}
            onChange={(e) => setSearchResult(e.target.value)}
            className="w-[360px] p-2 pl-10 border border-gray-400 rounded-lg bg-white placeholder-gray-500 focus:ring-green-500 focus:border-red-500"
          />
        </div>
      }

      <ul className="flex flex-col items-center w-[400px] h-[500px] overflow-y-auto ">
        {!chooseResult && !startTracking && displayBuslines.map((data) => (
          <li
            onClick={() => handleChoosingBus(data)}
            key={data.id}
            className="flex text-gray-800 w-[340px] items-start space-x-4 p-3 bg-white border border-gray-100 rounded-lg cursor-pointer transition duration-200 hover:bg-indigo-50 hover:shadow-md mb-3">
            <div
              className="flex-shrink-0 p-2  rounded-full mt-0.5"
              style={{ backgroundColor: data.color + '10' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className=" w-5 h-5 fill-current" style={{ color: data.color }}
              ><path d="M288 0C422.4 0 512 35.2 512 80l0 16 0 32c17.7 0 32 14.3 32 32l0 64c0 17.7-14.3 32-32 32l0 160c0 17.7-14.3 32-32 32l0 32c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-32-192 0 0 32c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-32c-17.7 0-32-14.3-32-32l0-160c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32c0 0 0 0 0 0l0-32s0 0 0 0l0-16C64 35.2 153.6 0 288 0zM128 160l0 96c0 17.7 14.3 32 32 32l112 0 0-160-112 0c-17.7 0-32 14.3-32 32zM304 288l112 0c17.7 0 32-14.3 32-32l0-96c0-17.7-14.3-32-32-32l-112 0 0 160zM144 400a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm288 0a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM384 80c0-8.8-7.2-16-16-16L208 64c-8.8 0-16 7.2-16 16s7.2 16 16 16l160 0c8.8 0 16-7.2 16-16z" /></svg>

            </div>

            <div className="flex flex-col  min-w-0">
              <div className='text-sm font-bold flex items-baseline justify-between mb-1'>
                <p >
                  Bus Line: {data.id}
                </p>
              </div>

              <p className="text-sm mt-1 mb-1 truncate">
                station:  {data.station}
              </p>

              <p className="text-sm mt-1 mb-1 truncate">
                Start: {data.start}
              </p>

              <p className="text-sm truncate">
                End: {data.end}
              </p>
            </div>
          </li>
        ))}

        {/* show the chosen bus line number and input box for license number */}
        {chooseResult && !startTracking &&
          <>
            <li
              className="flex text-gray-800 w-[340px] items-start space-x-4 p-3 bg-white border border-gray-100 rounded-lg cmb-3">
              <div
                className="flex-shrink-0 p-2  rounded-full mt-0.5"
                style={{ backgroundColor: chooseResult.color + '10' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className=" w-5 h-5 fill-current" style={{ color: chooseResult.color }}
                ><path d="M288 0C422.4 0 512 35.2 512 80l0 16 0 32c17.7 0 32 14.3 32 32l0 64c0 17.7-14.3 32-32 32l0 160c0 17.7-14.3 32-32 32l0 32c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-32-192 0 0 32c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-32c-17.7 0-32-14.3-32-32l0-160c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32c0 0 0 0 0 0l0-32s0 0 0 0l0-16C64 35.2 153.6 0 288 0zM128 160l0 96c0 17.7 14.3 32 32 32l112 0 0-160-112 0c-17.7 0-32 14.3-32 32zM304 288l112 0c17.7 0 32-14.3 32-32l0-96c0-17.7-14.3-32-32-32l-112 0 0 160zM144 400a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm288 0a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM384 80c0-8.8-7.2-16-16-16L208 64c-8.8 0-16 7.2-16 16s7.2 16 16 16l160 0c8.8 0 16-7.2 16-16z" /></svg>
              </div>

              <div className="flex flex-col  min-w-0">
                <div className='text-sm font-bold flex items-baseline justify-between mb-1'>
                  <p >
                    Bus Line: {chooseResult.id}
                  </p>
                </div>

                <p className="text-sm mt-1 mb-1 truncate">
                  station:  {chooseResult.station}
                </p>

                <p className="text-sm mt-1 mb-1 truncate">
                  Start: {chooseResult.start}
                </p>

                <p className="text-sm truncate">
                  End: {chooseResult.end}
                </p>
              </div>
            </li>
            <li>
              <input
                type="search"
                placeholder="Enter your bus license number"
                value={licenseNoInput}
                onChange={(e) => setLicenseNoInput(e.target.value)}
                className="w-[360px] p-2 pl-10 mt-5 border border-gray-400 rounded-lg bg-white placeholder-gray-500 focus:ring-green-500 focus:border-red-500"
              />
            </li>
            <li className="flex gap-5">
              <button
                onClick={() => {
                  setChooseResult(null)
                  setLicenseNoInput("")
                }}
                className="w-full p-3 rounded-lg mt-5 border border-gray-500 bg-gray-300 text-gray-500 font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-lg cursor-pointer"
              >
                Back
              </button>
              <button
                disabled={licenseNoInput === ""}
                onClick={() => handleSubmitBus()}
                className={`w-full p-3 rounded-lg mt-5 ${licenseNoInput === ""
                  ? " bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-400 transition-colors shadow-lg hover:bg-green-600 cursor-pointer"
                  }`}
              >
                Submit
              </button>
            </li>
          </>

        }
        {displayBuslines.length === 0 &&
          <li>
            <div className="flex flex-col items-center justify-center p-8 text-center text-gray-500 mt-20">
              <p className="text-xl font-semibold mb-2">No Buses Match</p>
              <p className="text-sm">
                Try searching for a different line number or ID.
              </p>
            </div>
          </li>
        }
        {startTracking &&
          <li>
            <div className="flex flex-col items-center justify-center p-8 text-center mt-20">
              <p className="text-xl font-semibold mb-2">Bus line: &quot; {chooseResult.id} &quot;</p>
              <p className="text-xl font-semibold mb-2">License number: &quot; {licenseNoInput} &quot;</p>
              <p className="mt-5">
                . . . .  Start tracking bus line &quot; {chooseResult.id} &quot; . . . .
              </p>
              <p className="text-sm mt-5">
                Please Don&apos;t close your website :3
              </p>
            </div>
          </li>
        }
      </ul>
    </div>
  );
}
