import SwarmGame from "@/components/SwarmGame";

export const metadata = {
  title: "Swarm Game",
};

export default function SwarmPage() {
  return (
    <section className="p-6 flex flex-col items-center gap-4">
      <h1 className="text-3xl font-bold">Swarm Robotics Game</h1>
      <p className="text-gray-700 text-center max-w-2xl">
        Drop targets for a team of simple robots and watch how the swarm cooperates
        to collect them before the timer runs out.
      </p>
      <SwarmGame />
    </section>
  );
}

