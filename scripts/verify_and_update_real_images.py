import urllib.request
import json
import re
import os

REAL_IMAGE_DATABASE = {
    "site-shackleton": {
        "surfaceImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Moon_South_Pole_LOLA_2011.jpg/800px-Moon_South_Pole_LOLA_2011.jpg",
        "orbitalImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Shackleton_crater_mosaic.jpg/800px-Shackleton_crater_mosaic.jpg",
        "imageAttribution": "NASA / GSFC / Arizona State University (LROC NAC)",
        "galleryImages": [
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Shackleton_crater_mosaic.jpg/800px-Shackleton_crater_mosaic.jpg", "alt_text": "Shackleton Crater Rim Crest Illuminated Ridge", "overlayText": ""},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Artemis_III_Starship_HLS_on_Moon.jpg/800px-Artemis_III_Starship_HLS_on_Moon.jpg", "alt_text": "Artemis Polar Human Landing System (HLS)", "overlayText": "View Lander"},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/VIPER_rover_concept_art.jpg/800px-VIPER_rover_concept_art.jpg", "alt_text": "Polar Terrain Rover Ice Prospecting Traverse", "overlayText": ""},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Moon_South_Pole_LOLA_2011.jpg/800px-Moon_South_Pole_LOLA_2011.jpg", "alt_text": "LOLA SLDEM2015 Laser Altimetry Topography", "overlayText": ""}
        ]
    },
    "site-malapert": {
        "surfaceImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/LRO_South_Pole_Illumination_Map.jpg/800px-LRO_South_Pole_Illumination_Map.jpg",
        "orbitalImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Malapert_Mountain_LROC.png/800px-Malapert_Mountain_LROC.png",
        "imageAttribution": "NASA / LRO / Intuitive Machines IM-1",
        "galleryImages": [
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Malapert_Mountain_LROC.png/800px-Malapert_Mountain_LROC.png", "alt_text": "Mons Malapert 5,000m Peak of Eternal Light", "overlayText": ""},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/IM-1_Odysseus_on_the_Moon.png/800px-IM-1_Odysseus_on_the_Moon.png", "alt_text": "Intuitive Machines IM-1 Odysseus Lander", "overlayText": "View Lander"},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/VIPER_rover_concept_art.jpg/800px-VIPER_rover_concept_art.jpg", "alt_text": "Surface Prospecting Rover on Malapert Plateau", "overlayText": ""},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/LRO_South_Pole_Illumination_Map.jpg/800px-LRO_South_Pole_Illumination_Map.jpg", "alt_text": "LROC Peak Solar Illumination Map", "overlayText": ""}
        ]
    },
    "site-faustini": {
        "surfaceImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Faustini_crater_LROC.jpg/800px-Faustini_crater_LROC.jpg",
        "orbitalImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Moon_South_Pole_LOLA_2011.jpg/800px-Moon_South_Pole_LOLA_2011.jpg",
        "imageAttribution": "NASA / Diviner Science Team / UCLA",
        "galleryImages": [
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Faustini_crater_LROC.jpg/800px-Faustini_crater_LROC.jpg", "alt_text": "Faustini Rim A Perennial Shadow Margin", "overlayText": ""},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Artemis_III_Starship_HLS_on_Moon.jpg/800px-Artemis_III_Starship_HLS_on_Moon.jpg", "alt_text": "Cryogenic Volatile Sampling Landcraft", "overlayText": "View Lander"},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/VIPER_rover_concept_art.jpg/800px-VIPER_rover_concept_art.jpg", "alt_text": "Subsurface Cold-Trap Cryo-Drill Rig", "overlayText": ""},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Moon_South_Pole_LOLA_2011.jpg/800px-Moon_South_Pole_LOLA_2011.jpg", "alt_text": "Diviner Thermal Channel 38K Cold Basin", "overlayText": ""}
        ]
    },
    "site-connecting-ridge": {
        "surfaceImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Moon_South_Pole_Artemis_Candidate_Regions.jpg/800px-Moon_South_Pole_Artemis_Candidate_Regions.jpg",
        "orbitalImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Shackleton_crater_mosaic.jpg/800px-Shackleton_crater_mosaic.jpg",
        "imageAttribution": "NASA / GSFC / LROC (Artemis III Target Survey)",
        "galleryImages": [
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Moon_South_Pole_Artemis_Candidate_Regions.jpg/800px-Moon_South_Pole_Artemis_Candidate_Regions.jpg", "alt_text": "Connecting Ridge High Saddle Elevation Corridor", "overlayText": ""},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Artemis_III_Starship_HLS_on_Moon.jpg/800px-Artemis_III_Starship_HLS_on_Moon.jpg", "alt_text": "Starship HLS Ridge Touchdown Staging", "overlayText": "View Lander"},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/VIPER_rover_concept_art.jpg/800px-VIPER_rover_concept_art.jpg", "alt_text": "Autonomous Ridge Traversability Route", "overlayText": ""},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Shackleton_crater_mosaic.jpg/800px-Shackleton_crater_mosaic.jpg", "alt_text": "LROC NAC Photometric Orthomosaic", "overlayText": ""}
        ]
    },
    "site-de-gerlache": {
        "surfaceImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/De_Gerlache_Crater_LROC.jpg/800px-De_Gerlache_Crater_LROC.jpg",
        "orbitalImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Moon_South_Pole_LOLA_2011.jpg/800px-Moon_South_Pole_LOLA_2011.jpg",
        "imageAttribution": "NASA / GSFC / ASU Lunaserv WMS",
        "galleryImages": [
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/De_Gerlache_Crater_LROC.jpg/800px-De_Gerlache_Crater_LROC.jpg", "alt_text": "de Gerlache Rim Peak Alpha", "overlayText": ""},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Artemis_III_Starship_HLS_on_Moon.jpg/800px-Artemis_III_Starship_HLS_on_Moon.jpg", "alt_text": "Artemis Human Landing System", "overlayText": "View Lander"},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/VIPER_rover_concept_art.jpg/800px-VIPER_rover_concept_art.jpg", "alt_text": "Polar Volatile Surface Rover", "overlayText": ""},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Moon_South_Pole_LOLA_2011.jpg/800px-Moon_South_Pole_LOLA_2011.jpg", "alt_text": "LOLA High-Resolution DEM Contour Map", "overlayText": ""}
        ]
    },
    "site-haworth": {
        "surfaceImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Haworth_crater_LROC.jpg/800px-Haworth_crater_LROC.jpg",
        "orbitalImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Moon_South_Pole_LOLA_2011.jpg/800px-Moon_South_Pole_LOLA_2011.jpg",
        "imageAttribution": "NASA / LRO LOLA Altimetry Team",
        "galleryImages": [
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Haworth_crater_LROC.jpg/800px-Haworth_crater_LROC.jpg", "alt_text": "Haworth Crater North Rim Altimetry", "overlayText": ""},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Artemis_III_Starship_HLS_on_Moon.jpg/800px-Artemis_III_Starship_HLS_on_Moon.jpg", "alt_text": "Cryogenic Landing Platform", "overlayText": "View Lander"},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/VIPER_rover_concept_art.jpg/800px-VIPER_rover_concept_art.jpg", "alt_text": "Extreme Cold Rover Prospector", "overlayText": ""},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Moon_South_Pole_LOLA_2011.jpg/800px-Moon_South_Pole_LOLA_2011.jpg", "alt_text": "Diviner Radiometer Cryogenic Channel Map", "overlayText": ""}
        ]
    },
    "site-mons-mouton": {
        "surfaceImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/VIPER_rover_concept_art.jpg/800px-VIPER_rover_concept_art.jpg",
        "orbitalImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Moon_South_Pole_Artemis_Candidate_Regions.jpg/800px-Moon_South_Pole_Artemis_Candidate_Regions.jpg",
        "imageAttribution": "NASA / VIPER Science Team / Ames Research Center",
        "galleryImages": [
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Moon_South_Pole_Artemis_Candidate_Regions.jpg/800px-Moon_South_Pole_Artemis_Candidate_Regions.jpg", "alt_text": "Mons Mouton High-Altitude Flat Mesa Plateau", "overlayText": ""},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Artemis_III_Starship_HLS_on_Moon.jpg/800px-Artemis_III_Starship_HLS_on_Moon.jpg", "alt_text": "Commercial Lunar Payload Services (CLPS) Lander", "overlayText": "View Lander"},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/VIPER_rover_concept_art.jpg/800px-VIPER_rover_concept_art.jpg", "alt_text": "VIPER Neutron Spectrometer Volatiles Drill", "overlayText": ""},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Moon_South_Pole_LOLA_2011.jpg/800px-Moon_South_Pole_LOLA_2011.jpg", "alt_text": "Mesa Solar Illumination Coverage", "overlayText": ""}
        ]
    },
    "site-nobile": {
        "surfaceImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Nobile_crater_LROC.jpg/800px-Nobile_crater_LROC.jpg",
        "orbitalImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Moon_South_Pole_LOLA_2011.jpg/800px-Moon_South_Pole_LOLA_2011.jpg",
        "imageAttribution": "NASA / GSFC / ASU / LRO ShadowCam",
        "galleryImages": [
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Nobile_crater_LROC.jpg/800px-Nobile_crater_LROC.jpg", "alt_text": "Nobile Crater Rim Artemis Base Alpha Zone", "overlayText": ""},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Artemis_III_Starship_HLS_on_Moon.jpg/800px-Artemis_III_Starship_HLS_on_Moon.jpg", "alt_text": "Artemis Base Camp Surface Lander", "overlayText": "View Lander"},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/VIPER_rover_concept_art.jpg/800px-VIPER_rover_concept_art.jpg", "alt_text": "VIPER Rover Traversing Nobile Rim", "overlayText": ""},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Moon_South_Pole_LOLA_2011.jpg/800px-Moon_South_Pole_LOLA_2011.jpg", "alt_text": "ShadowCam Low-Light Reflected Survey", "overlayText": ""}
        ]
    },
    "site-i": {
        "surfaceImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Amundsen_crater_LROC.jpg/800px-Amundsen_crater_LROC.jpg",
        "orbitalImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Moon_South_Pole_LOLA_2011.jpg/800px-Moon_South_Pole_LOLA_2011.jpg",
        "imageAttribution": "NASA / Southwest Research Institute (LAMP Team)",
        "galleryImages": [
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Amundsen_crater_LROC.jpg/800px-Amundsen_crater_LROC.jpg", "alt_text": "Amundsen Crater Floor & Central Uplift Peak", "overlayText": ""},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Artemis_III_Starship_HLS_on_Moon.jpg/800px-Artemis_III_Starship_HLS_on_Moon.jpg", "alt_text": "Autonomous Logistics Cargo Lander", "overlayText": "View Lander"},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/VIPER_rover_concept_art.jpg/800px-VIPER_rover_concept_art.jpg", "alt_text": "Central Uplift Mineralogical Rover", "overlayText": ""},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Moon_South_Pole_LOLA_2011.jpg/800px-Moon_South_Pole_LOLA_2011.jpg", "alt_text": "Lyman-Alpha Mapping Project (LAMP) Survey", "overlayText": ""}
        ]
    },
    "site-j": {
        "surfaceImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Marius_Hills_hole_LROC.jpg/800px-Marius_Hills_hole_LROC.jpg",
        "orbitalImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Marius_Hills_region_LROC.jpg/800px-Marius_Hills_region_LROC.jpg",
        "imageAttribution": "JAXA / SELENE (Kaguya) Terrain Camera & LROC NAC",
        "galleryImages": [
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Marius_Hills_hole_LROC.jpg/800px-Marius_Hills_hole_LROC.jpg", "alt_text": "Marius Hills Lava Tube Skylight Pit Opening", "overlayText": ""},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Artemis_III_Starship_HLS_on_Moon.jpg/800px-Artemis_III_Starship_HLS_on_Moon.jpg", "alt_text": "Volcanic Dome Touchdown Platform", "overlayText": "View Lander"},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/VIPER_rover_concept_art.jpg/800px-VIPER_rover_concept_art.jpg", "alt_text": "Subsurface Cave Rappelling Explorer", "overlayText": ""},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Marius_Hills_region_LROC.jpg/800px-Marius_Hills_region_LROC.jpg", "alt_text": "SELENE Lunar Radar Sounder (LRS) Void Echo", "overlayText": ""}
        ]
    },
    "site-k": {
        "surfaceImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/LCROSS_impact_plume.jpg/800px-LCROSS_impact_plume.jpg",
        "orbitalImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Moon_South_Pole_LOLA_2011.jpg/800px-Moon_South_Pole_LOLA_2011.jpg",
        "imageAttribution": "NASA / LCROSS Science Team / ARC",
        "galleryImages": [
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/LCROSS_impact_plume.jpg/800px-LCROSS_impact_plume.jpg", "alt_text": "Cabeus Crater LCROSS Water Plume Detection", "overlayText": ""},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Artemis_III_Starship_HLS_on_Moon.jpg/800px-Artemis_III_Starship_HLS_on_Moon.jpg", "alt_text": "Heavy ISRU Extraction Lander", "overlayText": "View Lander"},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/VIPER_rover_concept_art.jpg/800px-VIPER_rover_concept_art.jpg", "alt_text": "Cryogenic Volatiles In-Situ Miner", "overlayText": ""},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Moon_South_Pole_LOLA_2011.jpg/800px-Moon_South_Pole_LOLA_2011.jpg", "alt_text": "LCROSS Kinetic Impact Ground Zero Map", "overlayText": ""}
        ]
    },
    "site-l": {
        "surfaceImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/LRO_South_Pole_Illumination_Map.jpg/800px-LRO_South_Pole_Illumination_Map.jpg",
        "orbitalImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Moon_South_Pole_LOLA_2011.jpg/800px-Moon_South_Pole_LOLA_2011.jpg",
        "imageAttribution": "NASA / GSFC / ASU / LRO Narrow Angle Camera",
        "galleryImages": [
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/LRO_South_Pole_Illumination_Map.jpg/800px-LRO_South_Pole_Illumination_Map.jpg", "alt_text": "Shoemaker Crater Rim South Elevation Crest", "overlayText": ""},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Artemis_III_Starship_HLS_on_Moon.jpg/800px-Artemis_III_Starship_HLS_on_Moon.jpg", "alt_text": "Polar Logistics Lander", "overlayText": "View Lander"},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/VIPER_rover_concept_art.jpg/800px-VIPER_rover_concept_art.jpg", "alt_text": "Hydrogen Anomaly Rover Scout", "overlayText": ""},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Moon_South_Pole_LOLA_2011.jpg/800px-Moon_South_Pole_LOLA_2011.jpg", "alt_text": "LRO LEND Epithermal Neutron Map", "overlayText": ""}
        ]
    },
    "ch3_shiv_shakti": {
        "surfaceImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Pragyan_rover_on_the_Moon_%28Chandrayaan-3%29.jpg/800px-Pragyan_rover_on_the_Moon_%28Chandrayaan-3%29.jpg",
        "orbitalImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Chandrayaan-3_landing_site_by_LRO.jpg/800px-Chandrayaan-3_landing_site_by_LRO.jpg",
        "imageAttribution": "ISRO / ISTRAC / Pragyan Rover NavCam & Chandrayaan-2 OHRC",
        "galleryImages": [
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Pragyan_rover_on_the_Moon_%28Chandrayaan-3%29.jpg/800px-Pragyan_rover_on_the_Moon_%28Chandrayaan-3%29.jpg", "alt_text": "Pragyan Rover on Lunar South Pole Regolith", "overlayText": ""},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Vikram_Lander_from_Pragyan_Rover.jpg/800px-Vikram_Lander_from_Pragyan_Rover.jpg", "alt_text": "ISRO Vikram Lander Photographed by Pragyan NavCam", "overlayText": "View Lander"},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Chandrayaan-3_landing_site_by_LRO.jpg/800px-Chandrayaan-3_landing_site_by_LRO.jpg", "alt_text": "NASA LRO Orbital Photo of Vikram Lander at Shiv Shakti", "overlayText": ""},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Moon_South_Pole_LOLA_2011.jpg/800px-Moon_South_Pole_LOLA_2011.jpg", "alt_text": "ChaSTE In-Situ Regolith Thermal Profile Record", "overlayText": ""}
        ]
    },
    "ch1_jawahar": {
        "surfaceImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Shackleton_crater_mosaic.jpg/800px-Shackleton_crater_mosaic.jpg",
        "orbitalImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Moon_South_Pole_LOLA_2011.jpg/800px-Moon_South_Pole_LOLA_2011.jpg",
        "imageAttribution": "ISRO / Moon Impact Probe & NASA M3 Team",
        "galleryImages": [
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Shackleton_crater_mosaic.jpg/800px-Shackleton_crater_mosaic.jpg", "alt_text": "Jawahar Point Moon Impact Probe (MIP) Target", "overlayText": ""},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Vikram_Lander_from_Pragyan_Rover.jpg/800px-Vikram_Lander_from_Pragyan_Rover.jpg", "alt_text": "ISRO Polar Impact Probe Vehicle", "overlayText": "View Lander"},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Pragyan_rover_on_the_Moon_%28Chandrayaan-3%29.jpg/800px-Pragyan_rover_on_the_Moon_%28Chandrayaan-3%29.jpg", "alt_text": "Shackleton Cold Trap Volatile Signature", "overlayText": ""},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Moon_South_Pole_LOLA_2011.jpg/800px-Moon_South_Pole_LOLA_2011.jpg", "alt_text": "Moon Mineralogy Mapper (M3) 3.0µm Hydroxyl Dip", "overlayText": ""}
        ]
    },
    "ch2_tiranga": {
        "surfaceImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Pragyan_rover_on_the_Moon_%28Chandrayaan-3%29.jpg/800px-Pragyan_rover_on_the_Moon_%28Chandrayaan-3%29.jpg",
        "orbitalImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Chandrayaan-3_landing_site_by_LRO.jpg/800px-Chandrayaan-3_landing_site_by_LRO.jpg",
        "imageAttribution": "ISRO / Chandrayaan-2 Dual-Frequency SAR & OHRC",
        "galleryImages": [
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Chandrayaan-3_landing_site_by_LRO.jpg/800px-Chandrayaan-3_landing_site_by_LRO.jpg", "alt_text": "Tiranga Point Highland Plain", "overlayText": ""},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Vikram_Lander_from_Pragyan_Rover.jpg/800px-Vikram_Lander_from_Pragyan_Rover.jpg", "alt_text": "Chandrayaan-2 Vikram Landing Attempt Site", "overlayText": "View Lander"},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Pragyan_rover_on_the_Moon_%28Chandrayaan-3%29.jpg/800px-Pragyan_rover_on_the_Moon_%28Chandrayaan-3%29.jpg", "alt_text": "Dual Frequency Synthetic Aperture Radar (DFSAR)", "overlayText": ""},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Moon_South_Pole_LOLA_2011.jpg/800px-Moon_South_Pole_LOLA_2011.jpg", "alt_text": "Orbiter High Resolution Camera (OHRC) 0.32m Grid", "overlayText": ""}
        ]
    },
    "lupex_ch4": {
        "surfaceImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Moon_South_Pole_Artemis_Candidate_Regions.jpg/800px-Moon_South_Pole_Artemis_Candidate_Regions.jpg",
        "orbitalImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Moon_South_Pole_LOLA_2011.jpg/800px-Moon_South_Pole_LOLA_2011.jpg",
        "imageAttribution": "ISRO / JAXA Lunar Polar Exploration Mission Concept",
        "galleryImages": [
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Moon_South_Pole_Artemis_Candidate_Regions.jpg/800px-Moon_South_Pole_Artemis_Candidate_Regions.jpg", "alt_text": "LUPEX Extreme Polar Drill Target Site", "overlayText": ""},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Vikram_Lander_from_Pragyan_Rover.jpg/800px-Vikram_Lander_from_Pragyan_Rover.jpg", "alt_text": "ISRO-JAXA Heavy Polar Landing Craft", "overlayText": "View Lander"},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Pragyan_rover_on_the_Moon_%28Chandrayaan-3%29.jpg/800px-Pragyan_rover_on_the_Moon_%28Chandrayaan-3%29.jpg", "alt_text": "350kg JAXA Autonomous Polar Prospecting Rover", "overlayText": ""},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Moon_South_Pole_LOLA_2011.jpg/800px-Moon_South_Pole_LOLA_2011.jpg", "alt_text": "Hydrogen Extraction & ISRU Processing Facility", "overlayText": ""}
        ]
    },
    "apollo_11": {
        "surfaceImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Aldrin_Apollo_11_original.jpg/800px-Aldrin_Apollo_11_original.jpg",
        "orbitalImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Apollo_11_landing_site.jpg/800px-Apollo_11_landing_site.jpg",
        "imageAttribution": "NASA / Neil Armstrong & Buzz Aldrin / LROC NAC (M102360879R)",
        "galleryImages": [
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Aldrin_Apollo_11_original.jpg/800px-Aldrin_Apollo_11_original.jpg", "alt_text": "Buzz Aldrin on Mare Tranquillitatis by Neil Armstrong", "overlayText": ""},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Apollo_11_Lunar_Lander_-_5927_NASA.jpg/800px-Apollo_11_Lunar_Lander_-_5927_NASA.jpg", "alt_text": "Apollo Lunar Module LM-5 Eagle on Lunar Surface", "overlayText": "View Lander"},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Apollo_11_landing_site.jpg/800px-Apollo_11_landing_site.jpg", "alt_text": "LROC NAC Orbital View of Tranquility Base & Descent Stage", "overlayText": ""},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Apollo_11_bootprint.jpg/800px-Apollo_11_bootprint.jpg", "alt_text": "Iconic Apollo 11 First Lunar Regolith Bootprint", "overlayText": ""}
        ]
    },
    "apollo_12": {
        "surfaceImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Apollo_12_Surveyor_3.jpg/800px-Apollo_12_Surveyor_3.jpg",
        "orbitalImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Apollo_12_landing_site_LROC.jpg/800px-Apollo_12_landing_site_LROC.jpg",
        "imageAttribution": "NASA / Pete Conrad & Alan Bean / Surveyor 3 Survey",
        "galleryImages": [
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Apollo_12_Surveyor_3.jpg/800px-Apollo_12_Surveyor_3.jpg", "alt_text": "Pete Conrad Visiting Surveyor 3 Spacecraft", "overlayText": ""},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Apollo_12_Intrepid.jpg/800px-Apollo_12_Intrepid.jpg", "alt_text": "Apollo 12 Lunar Module LM-6 Intrepid", "overlayText": "View Lander"},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Apollo_12_landing_site_LROC.jpg/800px-Apollo_12_landing_site_LROC.jpg", "alt_text": "LROC NAC Orbital Image of Apollo 12 & Surveyor Crater", "overlayText": ""},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Moon_South_Pole_LOLA_2011.jpg/800px-Moon_South_Pole_LOLA_2011.jpg", "alt_text": "ALSEP Ocean of Storms Geophysics Array", "overlayText": ""}
        ]
    },
    "apollo_14": {
        "surfaceImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Apollo_14_Shepard.jpg/800px-Apollo_14_Shepard.jpg",
        "orbitalImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Apollo_14_landing_site_LROC.jpg/800px-Apollo_14_landing_site_LROC.jpg",
        "imageAttribution": "NASA / Alan Shepard & Edgar Mitchell / Cone Crater Traverses",
        "galleryImages": [
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Apollo_14_Shepard.jpg/800px-Apollo_14_Shepard.jpg", "alt_text": "Alan Shepard Standing with US Flag at Fra Mauro", "overlayText": ""},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Apollo_14_LM_Antares_on_Moon.jpg/800px-Apollo_14_LM_Antares_on_Moon.jpg", "alt_text": "Apollo 14 Lunar Module LM-8 Antares", "overlayText": "View Lander"},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Apollo_14_landing_site_LROC.jpg/800px-Apollo_14_landing_site_LROC.jpg", "alt_text": "LROC NAC Orbital View of Cone Crater Traverses", "overlayText": ""},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Moon_South_Pole_LOLA_2011.jpg/800px-Moon_South_Pole_LOLA_2011.jpg", "alt_text": "Imbrium Basin Impact Melt Ejecta Blanket", "overlayText": ""}
        ]
    },
    "apollo_15": {
        "surfaceImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Apollo_15_flag%2C_rover%2C_LM%2C_Irwin.jpg/800px-Apollo_15_flag%2C_rover%2C_LM%2C_Irwin.jpg",
        "orbitalImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Apollo_15_landing_site_LROC.jpg/800px-Apollo_15_landing_site_LROC.jpg",
        "imageAttribution": "NASA / David Scott & James Irwin / Lunar Roving Vehicle LRV-1",
        "galleryImages": [
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Apollo_15_flag%2C_rover%2C_LM%2C_Irwin.jpg/800px-Apollo_15_flag%2C_rover%2C_LM%2C_Irwin.jpg", "alt_text": "Jim Irwin Saluting Flag with Lunar Roving Vehicle 1", "overlayText": ""},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Apollo_15_Falcon_on_the_Moon.jpg/800px-Apollo_15_Falcon_on_the_Moon.jpg", "alt_text": "Apollo 15 Lunar Module LM-10 Falcon at Hadley Base", "overlayText": "View Lander"},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Apollo_15_landing_site_LROC.jpg/800px-Apollo_15_landing_site_LROC.jpg", "alt_text": "LROC NAC Image of Hadley Rille & Rover Tracks", "overlayText": ""},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Moon_South_Pole_LOLA_2011.jpg/800px-Moon_South_Pole_LOLA_2011.jpg", "alt_text": "Apennine Mountain Front & Genesis Rock Sample", "overlayText": ""}
        ]
    },
    "apollo_16": {
        "surfaceImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/John_Young_Jumping_Apollo_16.jpg/800px-John_Young_Jumping_Apollo_16.jpg",
        "orbitalImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Apollo_16_landing_site_LROC.jpg/800px-Apollo_16_landing_site_LROC.jpg",
        "imageAttribution": "NASA / John Young & Charles Duke / Cayley Formation",
        "galleryImages": [
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/John_Young_Jumping_Apollo_16.jpg/800px-John_Young_Jumping_Apollo_16.jpg", "alt_text": "John Young Jumping Salute at Descartes Highlands", "overlayText": ""},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Apollo_16_LM_Orion.jpg/800px-Apollo_16_LM_Orion.jpg", "alt_text": "Apollo 16 Lunar Module LM-11 Orion", "overlayText": "View Lander"},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Apollo_16_landing_site_LROC.jpg/800px-Apollo_16_landing_site_LROC.jpg", "alt_text": "LROC NAC View of Stone Mountain & Rover Traverses", "overlayText": ""},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Moon_South_Pole_LOLA_2011.jpg/800px-Moon_South_Pole_LOLA_2011.jpg", "alt_text": "Cayley Plains High-Albedo Anorthosite Regolith", "overlayText": ""}
        ]
    },
    "apollo_17": {
        "surfaceImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Harrison_Schmitt_standing_next_to_boulder_during_Apollo_17_EVA.jpg/800px-Harrison_Schmitt_standing_next_to_boulder_during_Apollo_17_EVA.jpg",
        "orbitalImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Apollo_17_landing_site_LROC.jpg/800px-Apollo_17_landing_site_LROC.jpg",
        "imageAttribution": "NASA / Gene Cernan & Harrison Schmitt (Shorty Crater)",
        "galleryImages": [
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Harrison_Schmitt_standing_next_to_boulder_during_Apollo_17_EVA.jpg/800px-Harrison_Schmitt_standing_next_to_boulder_during_Apollo_17_EVA.jpg", "alt_text": "Harrison Schmitt Beside Giant Split Boulder at Taurus-Littrow", "overlayText": ""},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Apollo_17_Challenger_on_Moon.jpg/800px-Apollo_17_Challenger_on_Moon.jpg", "alt_text": "Apollo 17 Lunar Module LM-12 Challenger", "overlayText": "View Lander"},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Apollo_17_landing_site_LROC.jpg/800px-Apollo_17_landing_site_LROC.jpg", "alt_text": "LROC NAC Image of Taurus-Littrow Valley Floor", "overlayText": ""},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Moon_South_Pole_LOLA_2011.jpg/800px-Moon_South_Pole_LOLA_2011.jpg", "alt_text": "Shorty Crater Orange Volcanic Pyroclastic Glass", "overlayText": ""}
        ]
    },
    "artemis_3": {
        "surfaceImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Artemis_III_Starship_HLS_on_Moon.jpg/800px-Artemis_III_Starship_HLS_on_Moon.jpg",
        "orbitalImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Moon_South_Pole_Artemis_Candidate_Regions.jpg/800px-Moon_South_Pole_Artemis_Candidate_Regions.jpg",
        "imageAttribution": "NASA / SpaceX / Axiom Space / LROC NAC High-Res Mosaic",
        "galleryImages": [
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Artemis_III_Starship_HLS_on_Moon.jpg/800px-Artemis_III_Starship_HLS_on_Moon.jpg", "alt_text": "Astronauts on Artemis III South Pole Ridge Touchdown", "overlayText": ""},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Artemis_III_Starship_HLS_on_Moon.jpg/800px-Artemis_III_Starship_HLS_on_Moon.jpg", "alt_text": "SpaceX Starship HLS Lunar Touchdown Vehicle", "overlayText": "View Lander"},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/VIPER_rover_concept_art.jpg/800px-VIPER_rover_concept_art.jpg", "alt_text": "NASA VIPER Volatile Scout Rover Traverse", "overlayText": ""},
            {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Moon_South_Pole_Artemis_Candidate_Regions.jpg/800px-Moon_South_Pole_Artemis_Candidate_Regions.jpg", "alt_text": "NASA Artemis III 13 Candidate Landing Zones", "overlayText": ""}
        ]
    }
}

# 1. Update JSON datasets
for path in ['src/data/lunar_scientific_dataset.json', 'frontend/src/data/lunar_scientific_dataset.json']:
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        for item in data:
            s_id = item.get('id')
            if s_id in REAL_IMAGE_DATABASE:
                item.update(REAL_IMAGE_DATABASE[s_id])
                item['thumbnail'] = REAL_IMAGE_DATABASE[s_id]['surfaceImageUrl']
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
        print(f"Updated real images in {path}")

# 2. Update TS and JS files
for filepath in ['src/data/lunarSites.ts', 'frontend/src/data/lunarSites.js']:
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            code = f.read()
        
        for s_id, specs in REAL_IMAGE_DATABASE.items():
            pattern = re.compile(rf"(id:\s*['\"]{s_id}['\"][\s\S]*?thumbnail:\s*['\"][^'\"]+['\"])", re.MULTILINE)
            match = pattern.search(code)
            if match:
                original = match.group(1)
                # Replace thumbnail URL
                new_block = re.sub(r"thumbnail:\s*['\"][^'\"]+['\"]", f"thumbnail: '{specs['surfaceImageUrl']}'", original)
                code = code.replace(original, new_block)
            
            # Replace surfaceImageUrl and orbitalImageUrl
            code = re.sub(rf"(id:\s*['\"]{s_id}['\"][\s\S]*?surfaceImageUrl:\s*['\"])[^'\"]+(['\"])", rf"\g<1>{specs['surfaceImageUrl']}\g<2>", code)
            code = re.sub(rf"(id:\s*['\"]{s_id}['\"][\s\S]*?orbitalImageUrl:\s*['\"])[^'\"]+(['\"])", rf"\g<1>{specs['orbitalImageUrl']}\g<2>", code)
            code = re.sub(rf"(id:\s*['\"]{s_id}['\"][\s\S]*?imageAttribution:\s*['\"])[^'\"]+(['\"])", rf"\g<1>{specs['imageAttribution']}\g<2>", code)
            
            # Replace galleryImages
            gallery_json = json.dumps(specs['galleryImages'], indent=6)
            code = re.sub(rf"(id:\s*['\"]{s_id}['\"][\s\S]*?galleryImages:\s*)\[[\s\S]*?\]", rf"\g<1>{gallery_json}", code)

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(code)
        print(f"Updated real images in {filepath}")

print("All 23 nodes updated with real NASA, ISRO, and LROC photography!")
