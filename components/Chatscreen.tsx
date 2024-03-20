import React, {
  useLayoutEffect,
  useState,
  KeyboardEvent,
  useCallback,
} from "react";
import { BiSend } from "react-icons/bi";
import { v4 as uuidv4 } from "uuid";
import MessageHistory from "./MessageHistory";
import Homescreen from "./Homescreen";
import {
  SQLResponse,
  TMessage,
  TQuestions,
  RUNResponse,
  PlotlyResponse,
} from "@/helpers/types";
import { AxiosResponse } from "axios";
import { MESSAGE_TYPES } from "@/helpers/enums";
import { useRoot } from "@/context/ContextProvider";
import PlotlyComponent from "./Plotly";

type ChatscreenProps = {
  generateQuestions: () => Promise<AxiosResponse<any, any>>;
  generateSQL: (question: string) => Promise<SQLResponse>;
  runSQL: (sql: string) => Promise<RUNResponse>;
};

const Chatscreen: React.FC<ChatscreenProps> = ({
  generateQuestions,
  generateSQL,
  runSQL,
}: Readonly<ChatscreenProps>) => {
  const [message, setMessage] = useState<string>("");
  const [disabled, setDisabled] = useState(message.length === 0);
  const [loading, setLoading] = useState(true);
  const [generatedQuestions, setGeneratedQuestions] = useState({});
  const { showSideBar, messageHistory, handleChangeMessageHistory } = useRoot();
  const [showPlot, setShowPlot] = useState(false);
  const [questionsWithGraphs, setQuestionsWithGraphs] = useState<
    { question: string; graph: any }[]
  >([]);

  useLayoutEffect(() => {
    let isMounted = true;

    async function fetchData() {
      let questions = await generateQuestions();
      if (isMounted) {
        setGeneratedQuestions(questions);
        setLoading(false);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [generateQuestions]);

  const handleInputChange = (e: { target: { value: string } }) => {
    if (e.target.value.length > 0) {
      setMessage(e.target.value);
      setDisabled(false);
    } else {
      setMessage("");
      setDisabled(true);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const generateSQL1 = async () => {
    const mockSQLResponse = {
      id: "89559da1-7f58-4cb2-bcd5-22b45bfbf957",
      text: "SELECT DATE_PART('day', DATE_OF_SENTIMENT_DETECTED) AS day, COUNT(*) as apology_cases\nFROM SENTIMENTS\nWHERE SENTIMENTS = 'Apology'\nGROUP BY day\nORDER BY day.",
      type: "sql",
    };
    return mockSQLResponse;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const runSQL1 = async (sql: string) => {
    const mockRUNResponse = {
      df: '[{"ACCOUNT_NAME":"Barclays Execution Services Limited","NUMESCALATIONS":42},{"ACCOUNT_NAME":"IQVIA","NUMESCALATIONS":33},{"ACCOUNT_NAME":"Takeda Pharmaceuticals International AG","NUMESCALATIONS":30},{"ACCOUNT_NAME":"Bubba Gump","NUMESCALATIONS":30},{"ACCOUNT_NAME":"Enel Global Services S.r.l.","NUMESCALATIONS":29}]',
      id: "f9637185-3db2-4a79-acc7-ea7af25b2556",
      type: "df",
    };

    return mockRUNResponse;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  // const plotlyfig = {
  //   fig: '{"data":[{"x":["Barclays Execution Services Limited","IQVIA","Takeda Pharmaceuticals International AG","Bubba Gump","Enel Global Services S.r.l."],"y":[42,33,30,30,29],"type":"bar"}],"layout":{"title":{"text":"Top 5 Accounts with Highest Number of Escalations"}}}',
  //   id: "f9637185-3db2-4a79-acc7-ea7af25b2556",
  //   type: "plotly_figure",
  // };

  const handleSend = useCallback(async () => {
    if (message.length === 0) return;

    try {
      const newMessageId = uuidv4();
      const msg = message.slice();
      setMessage("");
      setDisabled(true);
      let newMessage: TMessage = {
        ai: "",
        user: msg,
        messageId: newMessageId,
        type: MESSAGE_TYPES.user,
      };

      handleChangeMessageHistory(newMessage);

      const aiRes = await generateSQL1(msg);

      if (
        aiRes?.text === "No SELECT statement could be found in the SQL code"
      ) {
        newMessage = {
          ai: aiRes?.text,
          user: "",
          messageId: uuidv4(),
          type: MESSAGE_TYPES.error,
        };
      } else if ("error" in aiRes) {
        newMessage = {
          ai: aiRes?.error as string,
          user: "",
          messageId: uuidv4(),
          type: MESSAGE_TYPES.error,
        };
      } else {
        newMessage = {
          ai: aiRes?.text,
          user: "",
          messageId: uuidv4(),
          type: MESSAGE_TYPES.sql,
        };

        // handleChangeMessageHistory(newMessage); // Display SQL response

        const runRes = await runSQL1(aiRes?.text); // Run SQL

        if (runRes.type === "df") {
          // Display data frame
          const newDataFrameMessage: TMessage = {
            ai: runRes.df,
            user: "",
            messageId: uuidv4(),
            type: MESSAGE_TYPES.df,
          };
          handleChangeMessageHistory(newDataFrameMessage);
        }
      }
    } catch (error: any) {
      console.error("Failed to handle send:", error);
    }
    setShowPlot(true);
  }, [message, handleChangeMessageHistory, generateSQL1, runSQL1]);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Enter" && !disabled) {
      handleSend();
      event.preventDefault();
    }
  };

  return (
    <div className={`z-10 bg-black-700 ${showSideBar ? "w-4/5" : "w-screen"}`}>
      {messageHistory?.length === 1 ? (
        <Homescreen
          questions={generatedQuestions as TQuestions}
          generateSQL={generateSQL1}
          loading={loading}
        />
      ) : (
        <>
           <MessageHistory runSQL={runSQL} />
        </>
      )}

      <div
        className={`z-10 fixed bottom-0 border-2 border-gray-800 p-2 mt-2 rounded-2xl m-8 ${
          showSideBar ? "w-[73vw]" : "w-11/12"
        }`}
      >
        <div className={`input-group flex`}>
          <input
            type="text"
            className="input m-2 w-full bg-transparent border-none outline-none"
            placeholder="Type your question..."
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <button
            disabled={disabled}
            className={`btn btn-square p-2 border rounded-xl ${
              disabled
                ? "border border-slate-800 bg-slate-800"
                : "border-white bg-white"
            }`}
          >
            <BiSend size={25} onClick={handleSend} className="text-gray-700" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatscreen;
