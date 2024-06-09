const MainContent = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-7xl">
        Kodagents
      </h1>
      <p className="mt-6 text-lg leading-8 text-gray-600">
        Kodagents is redefining the future of work with groundbreaking AI-driven
        solutions. As the first entirely AI-operated agency, we deploy
        specialized agents to revolutionize workflows, skyrocket productivity,
        and create unparalleled opportunities for professionals and businesses.
      </p>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <a
          href="#"
          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Get started
        </a>
        <a href="#" className="text-lg font-semibold leading-6 text-gray-900">
          Learn more <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  );
};

export default MainContent;
