import * as React from "react";
import SvgIcon from "@mui/material/SvgIcon";

export function SitemarkIcon() {
  return (
    <SvgIcon sx={{ height: 30, width: 150 }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="40 20 220 40">
        <defs>
          <linearGradient
            id="text-gradient-primary"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#0078d4" />
            <stop offset="100%" stopColor="#2b88d8" />
          </linearGradient>
          <linearGradient
            id="text-gradient-secondary"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="10%" stopColor="#00a2ff" />
            <stop offset="90%" stopColor="#0062b3" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow
              dx="1"
              dy="1"
              stdDeviation="1"
              floodColor="#0056b3"
              floodOpacity="0.3"
            />
          </filter>
        </defs>

        <g filter="url(#shadow)">
          <text
            x="40"
            y="50"
            fontFamily="'Arial', sans-serif"
            fontSize="36"
            fontWeight="bold"
            fill="url(#text-gradient-primary)"
          >
            <tspan letterSpacing="1">Act</tspan>
          </text>
          <text
            x="113"
            y="50"
            fontFamily="'Arial', sans-serif"
            fontSize="36"
            fontWeight="bold"
            fill="url(#text-gradient-secondary)"
          >
            <tspan letterSpacing="1">Table</tspan>
          </text>
        </g>

        <g opacity="0.7">
          <path
            d="M40,60 L75,60"
            stroke="#0078d4"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M200,60 L260,60"
            stroke="#0078d4"
            strokeWidth="1.5"
            fill="none"
          />
          <circle cx="85" cy="60" r="2" fill="#0078d4" />
          <circle cx="95" cy="60" r="2" fill="#0078d4" />
          <circle cx="105" cy="60" r="2" fill="#0078d4" />
          <circle cx="190" cy="60" r="2" fill="#0078d4" />
          <circle cx="180" cy="60" r="2" fill="#0078d4" />
          <circle cx="170" cy="60" r="2" fill="#0078d4" />
        </g>

        <path
          d="M40,56 L260,56"
          stroke="#ffffff"
          strokeWidth="0.5"
          strokeOpacity="0.7"
        />

        <g opacity="0.8">
          <path
            d="M120,25 L180,25"
            stroke="#00a2ff"
            strokeWidth="1"
            strokeDasharray="1,3"
          />
          <rect
            x="145"
            y="20"
            width="10"
            height="10"
            fill="none"
            stroke="#00a2ff"
            strokeWidth="1"
          />
          <circle cx="130" cy="25" r="2" fill="#00a2ff" />
          <circle cx="170" cy="25" r="2" fill="#00a2ff" />
        </g>

        <path
          d="M65,54 L235,54"
          strokeWidth="2"
          stroke="url(#text-gradient-primary)"
          filter="url(#glow)"
        />
      </svg>
    </SvgIcon>
  );
}

export function FacebookIcon() {
  return (
    <SvgIcon>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.68 15.92C2.88 15.24 0 11.96 0 8C0 3.6 3.6 0 8 0C12.4 0 16 3.6 16 8C16 11.96 13.12 15.24 9.32 15.92L8.88 15.56H7.12L6.68 15.92Z"
          fill="url(#paint0_linear_795_116)"
        />
        <path
          d="M11.12 10.2391L11.48 7.99914H9.36V6.43914C9.36 5.79914 9.6 5.31914 10.56 5.31914H11.6V3.27914C11.04 3.19914 10.4 3.11914 9.84 3.11914C8 3.11914 6.72 4.23914 6.72 6.23914V7.99914H4.72V10.2391H6.72V15.8791C7.16 15.9591 7.6 15.9991 8.04 15.9991C8.48 15.9991 8.92 15.9591 9.36 15.8791V10.2391H11.12Z"
          fill="white"
        />
        <defs>
          <linearGradient
            id="paint0_linear_795_116"
            x1="8"
            y1="0"
            x2="8"
            y2="15.9991"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#1AAFFF" />
            <stop offset="1" stopColor="#0163E0" />
          </linearGradient>
        </defs>
      </svg>
    </SvgIcon>
  );
}

export function GoogleIcon() {
  return (
    <SvgIcon>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15.68 8.18182C15.68 7.61455 15.6291 7.06909 15.5345 6.54545H8V9.64364H12.3055C12.1164 10.64 11.5491 11.4836 10.6982 12.0509V14.0655H13.2945C14.8073 12.6691 15.68 10.6182 15.68 8.18182Z"
          fill="#4285F4"
        />
        <path
          d="M8 16C10.16 16 11.9709 15.2873 13.2945 14.0655L10.6982 12.0509C9.98545 12.5309 9.07636 12.8218 8 12.8218C5.92 12.8218 4.15273 11.4182 3.52 9.52727H0.858182V11.5927C2.17455 14.2036 4.87273 16 8 16Z"
          fill="#34A853"
        />
        <path
          d="M3.52 9.52C3.36 9.04 3.26545 8.53091 3.26545 8C3.26545 7.46909 3.36 6.96 3.52 6.48V4.41455H0.858182C0.312727 5.49091 0 6.70545 0 8C0 9.29455 0.312727 10.5091 0.858182 11.5855L2.93091 9.97091L3.52 9.52Z"
          fill="#FBBC05"
        />
        <path
          d="M8 3.18545C9.17818 3.18545 10.2255 3.59273 11.0618 4.37818L13.3527 2.08727C11.9636 0.792727 10.16 0 8 0C4.87273 0 2.17455 1.79636 0.858182 4.41455L3.52 6.48C4.15273 4.58909 5.92 3.18545 8 3.18545Z"
          fill="#EA4335"
        />
      </svg>
    </SvgIcon>
  );
}
