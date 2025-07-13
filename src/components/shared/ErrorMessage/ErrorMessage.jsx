import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function ErrorMessage({ message = "Something went wrong." }) {
  return (
    <div
      className="
        w-full max-w-md
        mx-auto my-8
        rounded-xl border
        border-red-300 dark:border-red-800
        bg-red-50 dark:bg-red-900/20
        px-4 py-4 sm:px-6 sm:py-5
        flex items-start gap-3 sm:gap-4
        shadow-sm
      "
    >
      <div className="flex-shrink-0">
        <HiOutlineExclamationCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-500 dark:text-red-400" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm sm:text-base font-semibold text-red-800 dark:text-red-300">
          Error
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-red-700 dark:text-red-400 break-words">
          {message}
        </p>
      </div>
    </div>
  );
}
