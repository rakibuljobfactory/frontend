import React from "react";

export const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-gray-200 py-6 px-4 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center gap-2">
        {/* Under Development Note */}
        <p className="text-sm text-gray-600 max-w-2xl leading-relaxed">
          <span className="font-semibold text-amber-600">Note:</span> This web app is currently under development. If you encounter any errors or issues, please report them to{" "}
          <a
            href="mailto:support@gloriouslab.com"
            className="text-blue-600 font-medium hover:underline focus:outline-none"
          >
            cyberdaily01@gmail.com
          </a>
          . We will be happy to help you. Thank you!
        </p>

        {/* Branding & Rights */}
        <div className="pt-2 text-xs text-gray-400 border-t border-gray-100 w-full max-w-md mt-1">
          Powered by <span className="font-semibold text-indigo-600">Glorious Lab</span>
        </div>
      </div>
    </footer>
  );
};