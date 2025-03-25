/**
 * Repair Guide Service - Client-side functionality for FIY repair guides 
 * Uses Netlify Functions to handle Gemini AI interactions
 */

// Get repair guide from Netlify Function
async function getRepairGuide(query, imageFile = null) {
  try {
    // Create form data for the API call
    const formData = new FormData();
    formData.append('query', query);
    
    // Add image if provided
    if (imageFile) {
      formData.append('image', imageFile);
    }

    // Call the Netlify function
    const response = await fetch('/.netlify/functions/repair-guide', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate repair guide');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting repair guide:', error);
    
    // Fallback for common queries during development/testing
    if (query.toLowerCase().includes('faucet') || query.toLowerCase().includes('sink') || query.toLowerCase().includes('tap')) {
      return getMockLeakingFaucetResponse();
    } else if (query.toLowerCase().includes('table') || query.toLowerCase().includes('furniture') || query.toLowerCase().includes('wood')) {
      return getMockBrokenTableResponse();
    } else {
      // Generic fallback response
      return getGenericRepairResponse(query);
    }
  }
}

// Mock response for leaking faucet
function getMockLeakingFaucetResponse() {
  return {
    tools: [
      "Adjustable wrench",
      "Screwdriver (flathead and Phillips)",
      "Plumber's tape",
      "Replacement washers or cartridge",
      "Towels or rags"
    ],
    steps: [
      "Turn off the water supply under the sink or at the main water valve.",
      "Place towels around the work area to catch any water.",
      "Remove the faucet handle by unscrewing the decorative cap and removing the screw underneath.",
      "Use the adjustable wrench to loosen and remove the packing nut.",
      "Inspect the washer or cartridge for damage and replace if necessary.",
      "If replacing, take the old part to a hardware store to find an exact match.",
      "Apply plumber's tape to the threads before reassembling.",
      "Reassemble the faucet in reverse order.",
      "Turn the water back on and test for leaks."
    ],
    safety: [
      "Ensure water is completely turned off before disassembly",
      "Avoid using excessive force when tightening components",
      "Keep work area dry to prevent slips",
      "Wear gloves to protect hands from sharp edges"
    ],
    difficulty: "Easy",
    costSavings: "$75-150",
    professional: "No",
    videos: [
      "how to fix leaky bathroom faucet",
      "replace faucet washer DIY",
      "kitchen sink faucet repair"
    ]
  };
}

// Mock response for broken table
function getMockBrokenTableResponse() {
  return {
    tools: [
      "Wood glue",
      "Clamps",
      "Sandpaper (medium and fine grit)",
      "Wood filler",
      "Screwdriver",
      "Drill (if needed)",
      "Clean cloth"
    ],
    steps: [
      "Remove any loose parts and clean the broken area.",
      "Apply wood glue to both broken surfaces.",
      "Press the pieces together firmly, ensuring correct alignment.",
      "Secure with clamps and wipe away excess glue with a damp cloth.",
      "Let dry for 24 hours (refer to glue manufacturer's instructions).",
      "Remove clamps and fill any remaining gaps with wood filler.",
      "Once filler is dry, sand the area smooth starting with medium and finishing with fine-grit sandpaper.",
      "Refinish the area with matching stain or paint if necessary."
    ],
    safety: [
      "Wear gloves when handling splinters or broken edges",
      "Work in a well-ventilated area when using glue",
      "Keep small parts away from children",
      "Follow all manufacturer instructions for adhesives"
    ],
    difficulty: "Medium",
    costSavings: "$50-200",
    professional: "No",
    videos: [
      "repair broken wooden furniture",
      "how to fix table leg",
      "wood glue repair techniques"
    ]
  };
}

// Generic repair response based on query
function getGenericRepairResponse(query) {
  return {
    tools: [
      "Basic toolset (screwdrivers, pliers, wrenches)",
      "Appropriate adhesive or fasteners",
      "Cleaning supplies",
      "Safety equipment (gloves, glasses)",
      "Item-specific repair parts"
    ],
    steps: [
      `Assess the damage to your ${query} and identify broken components.`,
      "Clean the damaged area and remove any loose parts.",
      "Determine if parts need replacement or can be repaired.",
      "For replacement parts, check manufacturer website or local hardware store.",
      "Follow manufacturer guidelines for disassembly if available.",
      "Make repairs using appropriate tools and materials.",
      "Reassemble carefully, testing functionality as you go.",
      "Perform a final test to ensure the repair was successful."
    ],
    safety: [
      "Disconnect from power source before repair (if applicable)",
      "Wear appropriate safety gear (gloves, eye protection)",
      "Work in a well-ventilated area",
      "Keep small parts organized and away from children",
      "Follow manufacturer safety guidelines"
    ],
    difficulty: "Medium",
    costSavings: "$25-100",
    professional: "Maybe",
    videos: [
      `how to repair ${query}`,
      `DIY ${query} fix`,
      "home repair basics"
    ]
  };
}

export { getRepairGuide };
