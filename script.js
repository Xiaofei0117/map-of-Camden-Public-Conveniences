map.on('click', (event) => {
    const features = map.queryRenderedFeatures(event.point, {
        layers: ['pub']
    });
    if (!features.length) {
        return;
    }
    const feature = features[0];
    const popupContent = `<h3>${feature.properties.Name}</h3>
                          <p>Opening Hours: ${feature.properties['Opening Hours']}</p>
                          <p>Postcode: ${feature.properties.Postcode}</p>
                          <p>Telephone: ${feature.properties.Telephone}</p>`;
    const popup = new mapboxgl.Popup({ offset: [0, -15] })
        .setLngLat(feature.geometry.coordinates)
        .setHTML(popupContent)
        .addTo(map);
});

document.getElementById('menu-button').onclick = function() {
    var filters = document.getElementById('filters');
    if (filters.style.display === 'none') {
        filters.style.display = 'block';
    } else {
        filters.style.display = 'none';
    }
};

function applyFilters() {
    var free = document.getElementById('free').checked;
    var babyChanging = document.getElementById('baby-changing').checked;
    var accessible = document.getElementById('accessible').checked;
    var automatic = document.getElementById('automatic').checked;
    var removeUrinalOnly = document.getElementById('remove-urinal-only').checked;
    var conditions = [];

    if (free) {
        conditions.push(['==', ['get', 'Free'], 'yes']);
    }
    if (babyChanging) {
        conditions.push(['==', ['get', 'Baby Changing'], 'yes']);
    }
    if (accessible) {
        conditions.push(['==', ['get', 'Accessible'], 'yes']);
    }
    if (automatic) {
        conditions.push(['==', ['get', 'Automatic'], 'yes']);
    }
    if (removeUrinalOnly) {
        conditions.push(['==', ['get', 'Urinal Only'], 'no']);
    }

    var filter = conditions.length ? ['all', ...conditions] : null;
    map.setFilter('pub', filter);
}

document.getElementById('free').onchange = applyFilters;
document.getElementById('baby-changing').onchange = applyFilters;
document.getElementById('accessible').onchange = applyFilters;
document.getElementById('automatic').onchange = applyFilters;
document.getElementById('remove-urinal-only').onchange = applyFilters;

applyFilters();

document.getElementById('search-input').addEventListener('keyup', function(e) {
    var existingPopups = document.getElementsByClassName('mapboxgl-popup');
    while(existingPopups.length) {
        existingPopups[0].remove();
    }

    var searchTerm = e.target.value.trim();
    if (!searchTerm) {
        return;
    }

    var features = map.queryRenderedFeatures({
        layers: ['pub'],
        filter: ['==', ['get', 'Street'], searchTerm]
    });


    if (features.length) {
        var feature = features[0];
        var popupContent = `<h3>${feature.properties.Name}</h3>
                            <p>Opening Hours: ${feature.properties['Opening Hours']}</p>
                            <p>Postcode: ${feature.properties.Postcode}</p>
                            <p>Telephone: ${feature.properties.Telephone}</p>`;
        new mapboxgl.Popup({ offset: [0, -15] })
            .setLngLat(feature.geometry.coordinates)
            .setHTML(popupContent)
            .addTo(map);

        map.flyTo({ center: feature.geometry.coordinates });
    }
});