"use client";
import React, { useState, useCallback, ChangeEvent } from "react";
import ChatBubble from "./ChatBubble";
import { TMessage, RUNResponse } from "@/helpers/types";
import { MESSAGE_TYPES, MODES } from "@/helpers/enums";
import { v4 as uuidV4 } from "uuid";
import Table from "./Table";
import { useRoot } from "@/context/ContextProvider";
import ChatButtons from "./ChatButtons";
import useChatScroll from "./ChatScroll";
import CodeContainer from "./CodeContainer";
import PlotlyComponent from "./Plotly";

type MessageHistoryProps = {
  runSQL: (sql: string) => Promise<RUNResponse>;
};
type ModesState = {
  [key: number]: string;
};

const MessageHistory = (props: MessageHistoryProps) => {
  const { runSQL } = props;
  const [modes, setModes] = useState<ModesState>({});

  const { messageHistory, handleChangeMessageHistory } = useRoot();
  const chatRef = useChatScroll(messageHistory);

  const handleModeChange = useCallback((ix: number, value: string) => {
    setModes((prevModes) => ({ ...prevModes, [ix]: value }));
  }, []);

  const [currSQL, setCurrSQL] = useState("");

  const handleRunClick = useCallback(
    async (val: TMessage, ix: number) => {
      try {
        handleModeChange(ix, MODES.run);
        let dfResponse = await runSQL(val.ai);
        let newMessage: TMessage = {
          ai: dfResponse?.df,
          user: "",
          messageId: uuidV4(),
          type: MESSAGE_TYPES.df,
        };

        if ("error" in dfResponse) {
          newMessage = {
            ai: dfResponse.error as string,
            user: "",
            messageId: uuidV4(),
            type: MESSAGE_TYPES.error,
          };
        }

        handleChangeMessageHistory(newMessage);
      } catch (error: any) {
        console.error(error);
      }
    },
    [handleModeChange, runSQL, handleChangeMessageHistory]
  );

  const handleEditClick = (ix: number) => {
    handleModeChange(ix, MODES.edit);
  };

  const handleSaveClick = useCallback(
    (ix: number) => {
      handleModeChange(ix, MODES.run);

      if (currSQL.length > 0) {
        const newMessageHistory = messageHistory.map((msg, index): TMessage => {
          console.log("ixid", ix, index);
          return index === ix ? { ...msg, ai: currSQL } : msg;
        });
        handleChangeMessageHistory(undefined, newMessageHistory);
      }
    },
    [handleModeChange, handleChangeMessageHistory, messageHistory, currSQL]
  );

  const renderChild = (val: TMessage, ix: number) => {
    const handleChangeSQL = (e: ChangeEvent<HTMLTextAreaElement>): void => {
      e.preventDefault();
      const value = e.target.value;
      setCurrSQL(value);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const plotlyfig = {
      fig: '{"data":[{"x":["Barclays Execution Services Limited","IQVIA","Takeda Pharmaceuticals International AG","Bubba Gump","Enel Global Services S.r.l."],"y":[42,33,30,30,29],"type":"bar"}],"layout":{"title":{"text":"Top 5 Accounts with Highest Number of Escalations"}}}',
      id: "f9637185-3db2-4a79-acc7-ea7af25b2556",
      type: "plotly_figure",
    };

    const mode = modes[ix] || MODES.run;

    if (mode === MODES.edit) {
      return (
        <textarea
          className="flex p-6 text-white bg-gray-800 w-[50vw] min-h-48 font-base text-sm rounded"
          defaultValue={val.ai}
          onChange={handleChangeSQL}
        />
      );
    } else if (val.type === MESSAGE_TYPES.df) {
      const data = JSON.parse(val.ai);
      if (Array.isArray(data) && data.length === 0) {
        return <p className="font-bold text-xs">Relevant data not found!</p>;
      } else {
        return (
          <>
            <Table data={data} />
            <PlotlyComponent data={plotlyfig} />
          </>
        );
      }
    } else if (val.type === MESSAGE_TYPES.sql) {
      return <CodeContainer language="sql">{val.ai}</CodeContainer>;
    } else {
      const isAi = [MESSAGE_TYPES.error, MESSAGE_TYPES.ai].includes(val.type);
      const value = isAi ? val.ai : val.user;

      return <div className="font-normal text-base">{value}</div>;
    }
  };

  return (
    <div ref={chatRef} className="p-2 m-4 max-h-[80vh] overflow-y-scroll">
      {messageHistory?.map((val, ix) => (
        <div key={val?.messageId}>
          {val?.ai && (
            <div className="flex flex-row items-start justify-space-between">
              <ChatBubble
                title="Vanna"
                logo={"/assets/vanna_circle.png"}
                alt="red"
                child={renderChild(val, ix)}
              />

              <ChatButtons
                currentIndex={ix}
                messageHistory={messageHistory}
                value={val}
                mode={modes[ix] || MODES.run}
                handleRunClick={handleRunClick}
                handleEditClick={handleEditClick}
                handleSaveClick={handleSaveClick}
              />
            </div>
          )}

          {val?.user && (
            <ChatBubble
              title="User"
              logo={"/assets/user.png"}
              alt="blue"
              child={renderChild(val, ix)}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default MessageHistory;
