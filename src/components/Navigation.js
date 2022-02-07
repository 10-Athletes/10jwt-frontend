import React, { Fragment } from "react";


export default function Navigation() {
  const handleLogout = () => {
    window.localStorage.removeItem('jwt')
    window.location.reload()
  }
  
  return (
    <>
      <section className="bg-black overflow-hidden">
        <nav className="relative z-10 flex px-16 justify-between bg-transparent">
          <div className="pr-14 py-8">
            <a
              className="inline-block text-2xl text-white font-medium font-lato"
              href="/"
            >
              10Athletes
            </a>
          </div>
          <button className="navbar-burger lg:hidden self-center">
            <svg
              width="24"
              height="24"
              viewbox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect y="6" width="24" height="2" fill="white"></rect>
              <rect y="11" width="24" height="2" fill="white"></rect>
              <rect y="16" width="24" height="2" fill="white"></rect>
            </svg>
          </button>
          <div className="hidden lg:block py-8 lg:absolute lg:top-1/2 lg:left-1/2 lg:transform lg:-translate-y-1/2 lg:-translate-x-1/2">
            <ul className="flex justify-center">
              <li className="mr-12">
                <a className="text-gray-200 hover:text-gray-400" href="/rankings">
                  Rankings
                </a>
              </li>
              <li className="mr-12">
                <a className="text-gray-200 hover:text-gray-400" href="/profile">
                  Profile
                </a>
              </li>
              <li className="mr-12">
                <a className="text-gray-200 hover:text-gray-400" href="/results">
                  Submit Results
                </a>
              </li>
            </ul>
          </div>
          <div className="hidden lg:flex items-center py-8 px-4">
            <div className="flex items-center justify-center">
              <a
                className="inline-block text-sm text-white hover:underline font-heading"
                href="#!"
                onClick={handleLogout}
              >
                Logout
              </a>
            </div>
          </div>
        </nav>
        <div className="hidden navbar-menu fixed top-0 left-0 bottom-0 w-5/6 max-w-sm z-50">
          <div className="navbar-backdrop fixed inset-0 bg-gray-800 opacity-25"></div>
          <nav className="relative flex flex-row py-8 px-10 w-full h-full bg-black border-r overflow-y-auto">
            <a
              className="inline-block text-xl text-black font-medium font-heading mb-16 md:mb-32"
              href="#!"
            >
              <img
                className="h-8"
                width="auto"
                src="boldui-assets/logo/logo-boldui-light.svg"
                alt=""
              />
            </a>
            <ul className="mb-32">
              <li className="mb-10">
                <a className="flex items-center" href="#!">
                  <span className="mr-3 text-lg text-black">About</span>
                  <svg
                    width="16"
                    height="9"
                    viewbox="0 0 16 9"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.01 3.48047H0V5.57278H12.01V8.71124L16 4.52663L12.01 0.34201V3.48047Z"
                      fill="#FFEC3E"
                    ></path>
                  </svg>
                </a>
              </li>
              <li className="mb-10">
                <a className="flex items-center" href="#!">
                  <span className="mr-3 text-lg text-black">Company</span>
                  <svg
                    width="16"
                    height="9"
                    viewbox="0 0 16 9"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.01 3.48047H0V5.57278H12.01V8.71124L16 4.52663L12.01 0.34201V3.48047Z"
                      fill="#FFEC3E"
                    ></path>
                  </svg>
                </a>
              </li>
              <li className="mb-10">
                <a className="flex items-center" href="#!">
                  <span className="mr-3 text-lg text-black">Services</span>
                  <svg
                    width="16"
                    height="9"
                    viewbox="0 0 16 9"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.01 3.48047H0V5.57278H12.01V8.71124L16 4.52663L12.01 0.34201V3.48047Z"
                      fill="#FFEC3E"
                    ></path>
                  </svg>
                </a>
              </li>
              <li>
                <a className="flex items-center" href="#!">
                  <span className="mr-3 text-lg text-black">Contact</span>
                  <svg
                    width="16"
                    height="9"
                    viewbox="0 0 16 9"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.01 3.48047H0V5.57278H12.01V8.71124L16 4.52663L12.01 0.34201V3.48047Z"
                      fill="#FFEC3E"
                    ></path>
                  </svg>
                </a>
              </li>
            </ul>
            <a
              className="flex mb-8 items-center justify-center py-4 px-6 rounded-full bg-yellow-300 hover:bg-yellow-400 transform duration-200"
              href="#!"
            >
              <svg
                className="mr-3"
                width="16"
                height="9"
                viewbox="0 0 16 9"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.01 3.16553H0V5.24886H12.01V8.37386L16 4.20719L12.01 0.0405273V3.16553Z"
                  fill="black"
                ></path>
              </svg>
              <span className="text-sm font-medium uppercase tracking-wider">
                Sign Up
              </span>
            </a>
            <a
              className="flex mb-10 items-center text-black hover:underline"
              href="#!"
            >
              <span className="mr-2 text-sm">Register</span>
              <svg
                width="16"
                height="10"
                viewbox="0 0 16 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.01 3.95383H0V6.04614H12.01V9.1846L16 4.99998L12.01 0.815369V3.95383Z"
                  fill="#FFEC3E"
                ></path>
              </svg>
            </a>
            <p className="text-sm text-gray-500">
              All rights reserved © 10Athletes 2021
            </p>
          </nav>
        </div>
      </section>
    </>
  );
}
