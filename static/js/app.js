// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let selectedSample = metadata.find(entry => entry.id.toString() === sample);
    console.log(selectedSample)
    // Use d3 to select the panel with id of `#sample-metadata`
    let samplePanel = d3.select('#sample-metadata');

    // Use `.html("") to clear any existing metadata
    samplePanel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    samplePanel.html(
      `
      <p>ID: ${selectedSample.id}</p>
      <p>ETHNICITY: ${selectedSample.ethnicity}</p>
      <p>GENDER: ${selectedSample.gender}</p>
      <p>AGE: ${selectedSample.age}</p>
      <p>LOCATION: ${selectedSample.location}</p>
      <p>BBTYPE: ${selectedSample.bbtype}</p>
      <p>WFREQ: ${selectedSample.wfreq}</p>
      `
    );
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let selectedSample = samples.find(entry => entry.id === sample);

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = selectedSample.otu_ids;
    let otu_labels = selectedSample.otu_labels;
    let sample_values = selectedSample.sample_values;

    // Build a Bubble Chart
    let bubbleTrace = {
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids
      },
      text: otu_labels
    };

    let bubbleData = [bubbleTrace];

    let bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      showlegend: false,
    };

    // Render the Bubble Chart
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let otuIdsStr = otu_ids.map(id => 'OTU '+id.toString());

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let topTenIds = otuIdsStr.slice(0, 10).reverse();
    let topTenLabels = otu_labels.slice(0, 10).reverse();
    let topTenValues = sample_values.slice(0, 10).reverse();

    let barTrace = {
      x: topTenValues,
      y: topTenIds,
      type: 'bar',
      text: topTenLabels,
      orientation: 'h'
    }

    let barData = [barTrace];

    let barLayout = {
      title: 'Top 10 Bacteria Cultures Found',
      showlegend: false,
    }

    // Render the Bar Chart
    Plotly.newPlot('bar', barData, barLayout)
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let sampleNames = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select('#selDataset');

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (let i = 0; i < sampleNames.length; i++){
      dropdown.append('option').html(`<option value="${sampleNames[i]}">${sampleNames[i]}</option>`);
    }

    // Get the first sample from the list
    let firstSample = dropdown.select('option').text();

    // Build charts and metadata panel with the first sample
    console.log(firstSample)
    buildCharts(firstSample)
    buildMetadata(firstSample)
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Initialize the dashboard
init();
