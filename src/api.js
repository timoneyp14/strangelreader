export const getReading = async (prompt) => {
  try {
    const response = await fetch("https://us-central1-strangelreadingslive.cloudfunctions.net/getReading", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Error fetching reading:", error);
    return null;
  }
};
