import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center  bg-[#F2EDE9]  font-sans p-5 gap-10">
      <h1 className="border border-white bg-white text-black shadow-lg rounded-lg p-5">
        🚌. . . . GPS - Bus Tracking . . . . 🚌
      </h1>
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
        <input
          type="search"
          placeholder="Choose your bus line number . . ."
          className="w-[360px] p-2 pl-10 border border-gray-400 rounded-lg bg-white placeholder-gray-500 focus:ring-green-500 focus:border-red-500"
        />
      </div>
      <ul className="flex flex-col items-center w-[400px] h-[500px] overflow-y-auto ">
        {Array.from({ length: 60 }).map((_, i) => (
          <li
            key={i}
            className="flex text-gray-800 w-[340px] items-start space-x-4 p-3 bg-white border border-gray-100 rounded-lg cursor-pointer transition duration-200 hover:bg-indigo-50 hover:shadow-md mb-3">
            <div
              className="flex-shrink-0 p-2  rounded-full mt-0.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className=" w-5 h-5 fill-current"
              ><path d="M288 0C422.4 0 512 35.2 512 80l0 16 0 32c17.7 0 32 14.3 32 32l0 64c0 17.7-14.3 32-32 32l0 160c0 17.7-14.3 32-32 32l0 32c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-32-192 0 0 32c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-32c-17.7 0-32-14.3-32-32l0-160c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32c0 0 0 0 0 0l0-32s0 0 0 0l0-16C64 35.2 153.6 0 288 0zM128 160l0 96c0 17.7 14.3 32 32 32l112 0 0-160-112 0c-17.7 0-32 14.3-32 32zM304 288l112 0c17.7 0 32-14.3 32-32l0-96c0-17.7-14.3-32-32-32l-112 0 0 160zM144 400a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm288 0a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM384 80c0-8.8-7.2-16-16-16L208 64c-8.8 0-16 7.2-16 16s7.2 16 16 16l160 0c8.8 0 16-7.2 16-16z" /></svg>

            </div>

            <div className="flex flex-col  min-w-0">
              <div className='text-sm font-bold flex items-baseline justify-between mb-1'>
                <p >
                  Bus Line: {i+1}
                </p>
              </div>

              {/* Station */}
              <p className="text-sm mt-1 mb-1 truncate">
                station:  aaa
              </p>

              {/* Start Point */}
              <p className="text-sm mt-1 mb-1 truncate">
                Start: aaa
              </p>

              {/* End Point (New addition) */}
              <p className="text-sm truncate">
                End: aaa
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
