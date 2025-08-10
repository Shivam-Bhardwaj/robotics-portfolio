import SwarmGame from "@/components/SwarmGame";

export const metadata = { title: "Swarm" };

export default function SwarmPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold text-center mb-6">Swarm Robotics Playground</h1>
      <p className="text-center mb-8 text-gray-600">
        Experiment with a simple swarm and try to gather all robots at the target as fast as possible.
      </p>
      <SwarmGame />
    </div>

  );
}

