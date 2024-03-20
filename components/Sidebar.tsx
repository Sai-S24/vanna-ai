import React, { useEffect, useState } from "react";
import {
  HiArrowCircleRight,
  HiClock,
  HiCog,
  HiLogout,
  HiOutlineArrowCircleUp,
} from "react-icons/hi";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { Vanna } from "./Assets/vanna";
import { useRoot } from "@/context/ContextProvider";

export default function Sidebar() {
  const { showSideBar, handleShowSideBar } = useRoot();
  const [history, setHistory] = useState([
    {
      id: "b87fa653-46b0-45d9-ba02-0a1e9a6eea38",
      question:
        " What is the number of cases handled by each agent in the last year?",
    },
    {
      id: "f9637185-3db2-4a79-acc7-ea7af25b2556",
      question:
        "What are the top 5 Accounts with the highest number of escalation",
    },
    {
      id: "8916fb49-2696-465c-b3f1-67bcc8687c90",
      question:
        "How does the number of escalations change during seasons or holidays?",
    },
    {
      id: "b87fa653-46b0-45d9-ba02-0a1e9a6eea38",
      question:
        " What is the number of cases handled by each agent in the last year?",
    },
    {
      id: "b87fa653-46b0-45d9-ba02-0a1e9a6eea38",
      question:
        " What is the number of cases handled by each agent in the last year?",
    },
    {
      id: "b87fa653-46b0-45d9-ba02-0a1e9a6eea38",
      question:
        " What is the number of cases handled by each agent in the last year?",
    },
    {
      id: "b87fa653-46b0-45d9-ba02-0a1e9a6eea38",
      question:
        " What is the number of cases handled by each agent in the last year?",
    },
  ]);

  // useEffect(() => {
  //   if (showSideBar) {
  //     fetchHistory();
  //   }
  // }, [showSideBar]);

  // const fetchHistory = async () => {
  //   try {
  //     const response = await fetch("/api/v0/get_question_history");
  //     if (response.ok) {
  //       const data = await response.json();
  //       setHistory(data.questions);
  //     } else {
  //       console.error("Failed to fetch history");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching history:", error);
  //   }
  // };

  const handleShow = () => {
    handleShowSideBar(!showSideBar);
  };

  return (
    <div
      className={`z-50 min-h-screen transition-colors duration-300 ease-linear ${
        showSideBar ? "w-1/6 bg-black" : "w-20 bg-slate-700"
      } flex flex-col justify-start items-start px-2 ${
        showSideBar ? "shadow-right" : ""
      }`}
    >
    {showSideBar && (
      <div className="flex items-center justify-center h-20 w-84 mr-2">
        <Vanna />
      </div>
    )}
    <button
      className={`transition p-2 my-4 mx-2 rounded hover:-translate-y-1 hover:scale-110 duration-300 ${
        showSideBar ? "ml-auto" : ""
      }`}
      onClick={handleShow}
    >
      <HiArrowCircleRight />
    </button>


      <div className="flex flex-col">
        <IconButton
          icon={<HiOutlineChatBubbleLeftRight />}
          label="Chat"
          showSideBar={showSideBar}
        />
        <IconButton
          icon={<HiClock />}
          label="History"
          showSideBar={showSideBar}
        />

        <IconButton
          icon={<HiOutlineArrowCircleUp />}
          label="Model"
          showSideBar={showSideBar}
        />
        <IconButton
          icon={<HiCog />}
          label="Settings"
          showSideBar={showSideBar}
        />
      </div>

      <div className="mt-7 overflow-auto max-h-80">
        {showSideBar && history.length > 0 && (
          <div className="ml-7">
            <ul
              className="flex flex-wrap list-disc"
              style={{ paddingRight: "2rem" }}
            >
              {history.map((message) => (
                <li key={message.id} className="mb-4 text-white">
                  {message.question}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-auto">
        <hr className="border-gray-500 my-4" />
        <IconButton
          icon={<HiLogout />}
          label="Sign Out"
          showSideBar={showSideBar}
        />
      </div>
    </div>
  );
}

interface IconButtonProps {
  icon: JSX.Element;
  label: string;
  showSideBar: boolean;
}

function IconButton({ icon, label, showSideBar }: IconButtonProps) {
  return (
    <button
      className={`flex items-center transition p-2 my-2 mx-2 rounded hover:-translate-y-1 hover:scale-110 duration-300 ${
        !showSideBar ? "text-md" : ""
      }`}
    >
      {icon}
      {showSideBar && <span className="ml-2">{label}</span>}
    </button>
  );
}
