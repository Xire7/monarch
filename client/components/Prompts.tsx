import React from "react";

const Prompts = (props: {
  updateIssueNumber: any;
  issueNumber: number;
  issuesCount: number;
  issueMessage: string;
  additionalInfo: string;
}) => {
  return (
    <div
      className={`bg-stone-900 w-full h-full flex flex-col ${
        props.issueNumber - 1 == props.issuesCount ? "hidden" : ""
      }`}
    >
      <p className="px-16 pt-16 text-2xl font-light text-white animate-fadedown">
        {props.issueNumber} / {props.issuesCount}
      </p>
      <div className="flex flex-col justify-between h-full">
        <p className="p-16 text-4xl font-medium text-white animate-fadedown">
          {props.issueMessage}
        </p>
        <p className="p-16 text-2xl font-light text-white animate-fadedown">
          {props.additionalInfo}
        </p>
        <div className="p-16 justify-between flex animate-fadeup">
          <button
            onClick={() => props.updateIssueNumber(props.issueNumber + 1)}
            className="bg-orange-400 hover:bg-orange-300 text-white font-bold border-b-4 border-orange-600 hover:border-orange-400 rounded-xl hover:scale-110 transition-transform duration-300 w-64"
          >
            <p className="text-xl font-medium p-6">Make Revision</p>
          </button>
          <button
            onClick={() => props.updateIssueNumber(props.issueNumber + 1)}
            className="bg-neutral-100 hover:bg-neutral-200 text-black font-medium border-b-4 border-neutral-400 hover:border-neutral-400 rounded-xl hover:scale-110 transition-transform duration-300 w-64"
          >
            <p className="text-xl font-medium p-6">Ignore</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Prompts;
