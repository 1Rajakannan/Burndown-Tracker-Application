// In-memory data store for sprint data
const sprintStore = {
    sprints: new Map(),
    
    // PUBLIC_INTERFACE
    /**
     * Create a new sprint record
     * @param {Object} sprintData Sprint data object
     * @returns {Object} Created sprint object with ID
     */
    createSprint(sprintData) {
        const id = Date.now().toString();
        const sprint = {
            id,
            ...sprintData,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.sprints.set(id, sprint);
        return sprint;
    },

    // PUBLIC_INTERFACE
    /**
     * Get a sprint by ID
     * @param {string} id Sprint ID
     * @returns {Object|null} Sprint object or null if not found
     */
    getSprint(id) {
        return this.sprints.get(id) || null;
    },

    // PUBLIC_INTERFACE
    /**
     * Get all sprints
     * @returns {Array} Array of sprint objects
     */
    getAllSprints() {
        return Array.from(this.sprints.values());
    },

    // PUBLIC_INTERFACE
    /**
     * Update a sprint by ID
     * @param {string} id Sprint ID
     * @param {Object} updateData Updated sprint data
     * @returns {Object|null} Updated sprint object or null if not found
     */
    updateSprint(id, updateData) {
        const sprint = this.sprints.get(id);
        if (!sprint) return null;

        const updatedSprint = {
            ...sprint,
            ...updateData,
            id, // Ensure ID remains unchanged
            updatedAt: new Date()
        };
        this.sprints.set(id, updatedSprint);
        return updatedSprint;
    },

    // PUBLIC_INTERFACE
    /**
     * Delete a sprint by ID
     * @param {string} id Sprint ID
     * @returns {boolean} True if sprint was deleted, false if not found
     */
    deleteSprint(id) {
        return this.sprints.delete(id);
    },

    // PUBLIC_INTERFACE
    /**
     * Clear all sprints (mainly for testing purposes)
     */
    clearAll() {
        this.sprints.clear();
    }
};

module.exports = sprintStore;