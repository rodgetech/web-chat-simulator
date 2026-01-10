import type { SimulatedConversation } from "@/types/simulation";
import type { Message } from "@/types/message";

const STORAGE_KEY = "whatsapp-simulations";

/**
 * Load all simulations from localStorage
 * Converts date strings back to Date objects
 */
export const loadSimulations = (): Record<string, SimulatedConversation> => {
  if (typeof window === "undefined") return {};

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return {};

    const parsed = JSON.parse(data) as Record<string, SimulatedConversation>;

    // Convert date strings back to Date objects
    Object.values(parsed).forEach((sim) => {
      sim.createdAt = new Date(sim.createdAt);
      sim.updatedAt = new Date(sim.updatedAt);

      // Convert played message timestamps
      if (sim.playedMessages) {
        sim.playedMessages.forEach((msg) => {
          msg.timestamp = new Date(msg.timestamp);
        });
      }
    });

    return parsed;
  } catch (error) {
    console.error("Failed to load simulations from localStorage:", error);
    return {};
  }
};

/**
 * Save a single simulation to localStorage
 * Updates the updatedAt timestamp automatically
 */
export const saveSimulation = (
  simulation: SimulatedConversation
): void => {
  if (typeof window === "undefined") return;

  try {
    const existing = loadSimulations();

    // Update the updatedAt timestamp
    simulation.updatedAt = new Date();

    existing[simulation.id] = simulation;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch (error) {
    console.error("Failed to save simulation to localStorage:", error);
  }
};

/**
 * Delete a simulation from localStorage
 */
export const deleteSimulation = (id: string): void => {
  if (typeof window === "undefined") return;

  try {
    const existing = loadSimulations();
    delete existing[id];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch (error) {
    console.error("Failed to delete simulation from localStorage:", error);
  }
};

/**
 * Save all simulations at once (useful for bulk operations)
 */
export const saveAllSimulations = (
  simulations: Record<string, SimulatedConversation>
): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(simulations));
  } catch (error) {
    console.error("Failed to save all simulations to localStorage:", error);
  }
};

/**
 * Save played messages for a simulation
 * Updates only the playedMessages field and updatedAt timestamp
 */
export const savePlayedMessages = (
  simulationId: string,
  playedMessages: Message[]
): void => {
  if (typeof window === "undefined") return;

  try {
    const existing = loadSimulations();
    const simulation = existing[simulationId];

    if (!simulation) {
      console.error(`Simulation ${simulationId} not found`);
      return;
    }

    simulation.playedMessages = playedMessages;
    simulation.updatedAt = new Date();

    existing[simulationId] = simulation;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch (error) {
    console.error("Failed to save played messages:", error);
  }
};

/**
 * Clear played messages when entering edit mode
 * Forces simulation to be replayed after editing
 */
export const clearPlayedMessages = (simulationId: string): void => {
  if (typeof window === "undefined") return;

  try {
    const existing = loadSimulations();
    const simulation = existing[simulationId];

    if (!simulation) return;

    delete simulation.playedMessages;
    simulation.updatedAt = new Date();

    existing[simulationId] = simulation;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch (error) {
    console.error("Failed to clear played messages:", error);
  }
};
