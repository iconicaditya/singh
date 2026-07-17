-- ============================================================
-- DATABASE SCHEMA & SAMPLE DATA FOR RESEARCH LAB WEBSITE
-- ============================================================
-- This file contains:
-- 1. CREATE TABLE statements for all tables
-- 2. Sample data (15+ rows each) for: research, projects, 
--    publications, activities, gallery, team, collaborators,
--    researchThemes, hero, people
-- ============================================================

-- ============================================================
-- SECTION 1: CREATE TABLES
-- ============================================================

-- Research table
CREATE TABLE IF NOT EXISTS research (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    year VARCHAR(4) NOT NULL,
    tags TEXT,
    title_image TEXT,
    authors JSONB NOT NULL DEFAULT '[]'::jsonb,
    content_sections JSONB NOT NULL DEFAULT '[]'::jsonb,
    related_publications JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(500),
    category VARCHAR(100) NOT NULL,
    tags TEXT,
    team_members JSONB DEFAULT '[]'::jsonb,
    location VARCHAR(255),
    description TEXT NOT NULL,
    status VARCHAR(50) NOT NULL,
    image_url TEXT,
    about_project TEXT,
    project_objectives JSONB DEFAULT '[]'::jsonb,
    content_sections JSONB DEFAULT '[]'::jsonb,
    start_date VARCHAR(100),
    end_date VARCHAR(100),
    attached_research_ids JSONB DEFAULT '[]'::jsonb,
    link TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Publications table
CREATE TABLE IF NOT EXISTS publications (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    authors TEXT NOT NULL,
    year VARCHAR(4),
    publication_type VARCHAR(100),
    abstract TEXT,
    keywords TEXT,
    journal_conference_name VARCHAR(255),
    doi_url TEXT,
    pdf_url TEXT,
    cover_image_url TEXT,
    category VARCHAR(100),
    description TEXT,
    tags TEXT,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Gallery table
CREATE TABLE IF NOT EXISTS gallery (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    image_url TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Team table
CREATE TABLE IF NOT EXISTS team (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    social_links JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Activities table
CREATE TABLE IF NOT EXISTS activities (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    year VARCHAR(4) NOT NULL,
    tags TEXT,
    title_image TEXT,
    content_sections JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Collaborators table
CREATE TABLE IF NOT EXISTS collaborators (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255),
    logo_url TEXT,
    image_url TEXT,
    website TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Research Themes table
CREATE TABLE IF NOT EXISTS research_themes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    icon_image TEXT,
    points JSONB NOT NULL DEFAULT '[]'::jsonb,
    position INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Hero table
CREATE TABLE IF NOT EXISTS hero (
    id SERIAL PRIMARY KEY,
    main_heading VARCHAR(500) NOT NULL,
    subheading VARCHAR(500) NOT NULL,
    background_image TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- People table
CREATE TABLE IF NOT EXISTS people (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    role_designation VARCHAR(255) NOT NULL,
    profile_image TEXT NOT NULL,
    nationality VARCHAR(255),
    lab_id VARCHAR(100),
    education_background TEXT,
    past_teaching_background TEXT,
    publications JSONB DEFAULT '[]'::jsonb,
    cv_url TEXT,
    cv_links JSONB DEFAULT '[]'::jsonb,
    graduation_years JSONB DEFAULT '[]'::jsonb,
    research_topic VARCHAR(500),
    conference_presentation TEXT,
    linkedin_url TEXT,
    twitter_url TEXT,
    facebook_url TEXT,
    instagram_url TEXT,
    position INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Admin Users table
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- SECTION 2: SAMPLE DATA - HERO
-- ============================================================
INSERT INTO hero (main_heading, subheading, background_image) VALUES
('Advanced Research Laboratory', 'Pioneering innovations in sustainable engineering and technology for a better tomorrow', 'https://images.unsplash.com/photo-1562774053-701939374585?w=1920&q=80'),
('Center for Computational Research', 'Exploring the frontiers of artificial intelligence and machine learning', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80'),
('Sustainable Materials Lab', 'Developing eco-friendly materials for next-generation applications', 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1920&q=80');

-- ============================================================
-- SECTION 3: SAMPLE DATA - RESEARCH THEMES
-- ============================================================
INSERT INTO research_themes (title, icon_image, points, position) VALUES
('Artificial Intelligence & Machine Learning', 
 'https://cdn-icons-png.flaticon.com/512/2103/2103632.png',
 '["Deep Learning for Medical Imaging", "Natural Language Processing", "Reinforcement Learning Applications", "Explainable AI Systems", "Edge AI and TinyML"]'::jsonb, 1),
('Sustainable Energy Systems', 
 'https://cdn-icons-png.flaticon.com/512/3103/3103446.png',
 '["Solar Energy Harvesting", "Wind Energy Optimization", "Energy Storage Technologies", "Smart Grid Integration", "Green Building Design"]'::jsonb, 2),
('Advanced Materials Engineering', 
 'https://cdn-icons-png.flaticon.com/512/2942/2942789.png',
 '["Nanomaterials Synthesis", "Polymer Composites", "Biodegradable Materials", "Smart Materials and Coatings", "Additive Manufacturing"]'::jsonb, 3),
('Environmental Biotechnology', 
 'https://cdn-icons-png.flaticon.com/512/3062/3062634.png',
 '["Wastewater Treatment", "Bioremediation Techniques", "Biofuel Production", "Microbial Ecology", "Environmental Monitoring"]'::jsonb, 4),
('Robotics & Automation', 
 'https://cdn-icons-png.flaticon.com/512/3209/3209907.png',
 '["Autonomous Navigation", "Human-Robot Interaction", "Soft Robotics", "Industrial Automation", "Swarm Robotics"]'::jsonb, 5),
('Data Science & Analytics', 
 'https://cdn-icons-png.flaticon.com/512/2621/2621304.png',
 '["Big Data Analytics", "Predictive Modeling", "Data Visualization", "Statistical Learning", "Business Intelligence"]'::jsonb, 6);

-- ============================================================
-- SECTION 4: SAMPLE DATA - RESEARCH
-- ============================================================
INSERT INTO research (title, category, year, tags, title_image, authors, content_sections, related_publications) VALUES
(
    'Deep Learning Framework for Early Detection of Retinal Diseases',
    'Artificial Intelligence',
    '2026',
    'deep learning, medical imaging, retinal diseases, CNN',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    '[{"name": "Dr. Aditya Singh", "image": "https://randomuser.me/api/portraits/men/32.jpg"}, {"name": "Prof. Sarah Johnson", "image": "https://randomuser.me/api/portraits/women/44.jpg"}, {"name": "Dr. Michael Chen", "image": "https://randomuser.me/api/portraits/men/45.jpg"}]'::jsonb,
    '[{"title": "Overview", "content": "This research focuses on developing a novel deep learning framework for early detection of retinal diseases using fundus images. The framework utilizes convolutional neural networks with attention mechanisms to achieve state-of-the-art accuracy in detecting diabetic retinopathy, glaucoma, and age-related macular degeneration.", "image": "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&q=80"}, {"title": "Methodology", "content": "We employed a hybrid CNN-Transformer architecture trained on over 100,000 fundus images from multiple clinical centers. The model incorporates explainable AI techniques to highlight regions of interest for clinicians.", "image": "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=600&q=80"}, {"title": "Results", "content": "Our framework achieved 98.2% accuracy in detecting diabetic retinopathy, 96.7% for glaucoma, and 95.3% for macular degeneration, outperforming existing methods by 3-5%.", "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80"}]'::jsonb,
    '[{"title": "Retinal Disease Detection using Deep Learning", "journal": "IEEE Transactions on Medical Imaging", "year": "2025"}, {"title": "Attention Mechanisms in Medical Image Analysis", "journal": "Nature Digital Medicine", "year": "2025"}]'::jsonb
),
(
    'Optimization of Perovskite Solar Cells for High Efficiency',
    'Sustainable Energy',
    '2026',
    'perovskite, solar cells, renewable energy, photovoltaics',
    'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80',
    '[{"name": "Dr. Emily Rodriguez", "image": "https://randomuser.me/api/portraits/women/33.jpg"}, {"name": "Dr. James Wilson", "image": "https://randomuser.me/api/portraits/men/22.jpg"}]'::jsonb,
    '[{"title": "Research Background", "content": "Perovskite solar cells have emerged as a promising alternative to traditional silicon-based solar cells due to their high efficiency and low manufacturing cost. This research aims to optimize the composition and fabrication process to achieve maximum power conversion efficiency.", "image": "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&q=80"}, {"title": "Experimental Approach", "content": "We systematically varied the composition of perovskite materials and optimized the deposition parameters using a combinatorial approach. Advanced characterization techniques including XRD, SEM, and PL spectroscopy were employed.", "image": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80"}, {"title": "Key Findings", "content": "We achieved a record power conversion efficiency of 26.1% with enhanced stability, maintaining 90% of initial efficiency after 1000 hours of continuous operation.", "image": "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&q=80"}]'::jsonb,
    '[]'::jsonb
),
(
    'Biodegradable Polymer Composites for Sustainable Packaging',
    'Advanced Materials',
    '2025',
    'biodegradable, polymers, sustainable packaging, composites',
    'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=800&q=80',
    '[{"name": "Prof. David Kim", "image": "https://randomuser.me/api/portraits/men/55.jpg"}, {"name": "Dr. Lisa Zhang", "image": "https://randomuser.me/api/portraits/women/28.jpg"}, {"name": "Dr. Raj Patel", "image": "https://randomuser.me/api/portraits/men/36.jpg"}]'::jsonb,
    '[{"title": "Introduction", "content": "Plastic pollution is a global crisis. This research develops biodegradable polymer composites from renewable resources that can replace conventional plastics in packaging applications.", "image": "https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=600&q=80"}, {"title": "Materials and Methods", "content": "We synthesized composites using PLA, PHA, and natural fibers including cellulose nanocrystals and chitin. Mechanical testing and degradation studies were conducted under various environmental conditions.", "image": "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&q=80"}, {"title": "Applications", "content": "The developed materials show excellent mechanical properties comparable to conventional plastics and fully degrade within 90 days in composting conditions.", "image": "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&q=80"}]'::jsonb,
    '[]'::jsonb
),
(
    'Autonomous Drone Navigation in GPS-Denied Environments',
    'Robotics',
    '2025',
    'drones, autonomous navigation, SLAM, GPS-denied',
    'https://images.unsplash.com/photo-1508614589041-895f88991d1c?w=800&q=80',
    '[{"name": "Dr. Alex Turner", "image": "https://randomuser.me/api/portraits/men/41.jpg"}, {"name": "Maria Santos", "image": "https://randomuser.me/api/portraits/women/50.jpg"}]'::jsonb,
    '[{"title": "Project Overview", "content": "This research addresses the challenge of autonomous drone navigation in environments where GPS signals are unavailable, such as indoor spaces, tunnels, and dense urban areas.", "image": "https://images.unsplash.com/photo-1508614589041-895f88991d1c?w=600&q=80"}, {"title": "Technical Approach", "content": "We developed a visual-inertial SLAM system combined with deep reinforcement learning for real-time path planning. The system uses stereo cameras and IMU sensors for localization.", "image": "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&q=80"}, {"title": "Results", "content": "The system achieved 95% success rate in navigating complex indoor environments with an average localization error of less than 10cm.", "image": "https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=600&q=80"}]'::jsonb,
    '[]'::jsonb
),
(
    'Machine Learning for Predictive Maintenance in Manufacturing',
    'Data Science',
    '2025',
    'predictive maintenance, machine learning, manufacturing, IoT',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80',
    '[{"name": "Dr. Robert Brown", "image": "https://randomuser.me/api/portraits/men/48.jpg"}, {"name": "Dr. Anna Kowalski", "image": "https://randomuser.me/api/portraits/women/26.jpg"}]'::jsonb,
    '[{"title": "Research Context", "content": "Predictive maintenance using machine learning can significantly reduce downtime and maintenance costs in manufacturing. This research develops a comprehensive framework for real-time equipment monitoring and failure prediction.", "image": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80"}, {"title": "Methodology", "content": "We deployed IoT sensors on industrial equipment and collected vibration, temperature, and acoustic data. Multiple ML models including Random Forest, LSTM, and Transformer architectures were compared.", "image": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80"}, {"title": "Impact", "content": "The system achieved 94% accuracy in predicting equipment failures 48 hours in advance, reducing unplanned downtime by 60%.", "image": "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&q=80"}]'::jsonb,
    '[]'::jsonb
),
(
    'Wastewater Treatment Using Microbial Fuel Cells',
    'Environmental Biotechnology',
    '2024',
    'wastewater, microbial fuel cells, bioenergy, treatment',
    'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&q=80',
    '[{"name": "Dr. Priya Sharma", "image": "https://randomuser.me/api/portraits/women/68.jpg"}, {"name": "Prof. John Miller", "image": "https://randomuser.me/api/portraits/men/75.jpg"}]'::jsonb,
    '[{"title": "Background", "content": "Microbial fuel cells (MFCs) offer a sustainable approach to wastewater treatment by simultaneously treating water and generating electricity. This research optimizes MFC design for practical applications.", "image": "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&q=80"}, {"title": "Experimental Setup", "content": "We designed and tested multiple MFC configurations with different electrode materials and microbial consortia. Power density and COD removal efficiency were measured.", "image": "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&q=80"}, {"title": "Achievements", "content": "Achieved 92% COD removal efficiency with a maximum power density of 850 mW/m², making it viable for small-scale treatment plants.", "image": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80"}]'::jsonb,
    '[]'::jsonb
),
(
    'Natural Language Processing for Low-Resource Languages',
    'Artificial Intelligence',
    '2024',
    'NLP, low-resource languages, machine translation, transformers',
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
    '[{"name": "Dr. Wei Chen", "image": "https://randomuser.me/api/portraits/men/62.jpg"}, {"name": "Dr. Sarah O''Brien", "image": "https://randomuser.me/api/portraits/women/35.jpg"}]'::jsonb,
    '[{"title": "Research Focus", "content": "Many languages lack sufficient digital resources for NLP applications. This research develops techniques for building effective NLP systems for low-resource languages using transfer learning and data augmentation.", "image": "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80"}, {"title": "Approach", "content": "We developed a novel multilingual transfer learning framework that leverages high-resource languages to improve performance on low-resource ones. Cross-lingual word embeddings and synthetic data generation were key components.", "image": "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&q=80"}, {"title": "Outcomes", "content": "Our approach improved translation quality by 35% for 10 low-resource languages and achieved state-of-the-art results on the FLORES benchmark.", "image": "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&q=80"}]'::jsonb,
    '[]'::jsonb
),
(
    'Smart Grid Integration of Renewable Energy Sources',
    'Sustainable Energy',
    '2024',
    'smart grid, renewable energy, integration, optimization',
    'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80',
    '[{"name": "Prof. Maria Garcia", "image": "https://randomuser.me/api/portraits/women/55.jpg"}, {"name": "Dr. Thomas Anderson", "image": "https://randomuser.me/api/portraits/men/30.jpg"}]'::jsonb,
    '[{"title": "Project Description", "content": "Integrating variable renewable energy sources into the power grid presents significant challenges. This research develops advanced control algorithms and energy management systems for smart grid applications.", "image": "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&q=80"}, {"title": "Technical Details", "content": "We developed a hierarchical control system using reinforcement learning for optimal dispatch of renewable generation and storage. Real-time grid data from multiple utilities was used for validation.", "image": "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&q=80"}, {"title": "Results", "content": "The system reduced renewable energy curtailment by 40% and improved grid stability with 99.5% voltage regulation compliance.", "image": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80"}]'::jsonb,
    '[]'::jsonb
),
(
    'Nanomaterial-Based Biosensors for Disease Detection',
    'Advanced Materials',
    '2024',
    'nanomaterials, biosensors, disease detection, diagnostics',
    'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&q=80',
    '[{"name": "Dr. Yuki Tanaka", "image": "https://randomuser.me/api/portraits/men/38.jpg"}, {"name": "Dr. Rachel Green", "image": "https://randomuser.me/api/portraits/women/46.jpg"}]'::jsonb,
    '[{"title": "Research Overview", "content": "Early disease detection is critical for effective treatment. This research develops highly sensitive biosensors using nanomaterials including graphene, quantum dots, and gold nanoparticles.", "image": "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=600&q=80"}, {"title": "Sensor Development", "content": "We fabricated electrochemical and optical biosensors functionalized with specific antibodies and aptamers for detecting cancer biomarkers and infectious diseases.", "image": "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&q=80"}, {"title": "Performance", "content": "The biosensors achieved detection limits as low as 1 fg/mL for cancer biomarkers, with response times under 10 minutes and high specificity.", "image": "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600&q=80"}]'::jsonb,
    '[]'::jsonb
),
(
    'Human-Robot Collaboration in Assembly Tasks',
    'Robotics',
    '2024',
    'human-robot collaboration, assembly, safety, cobots',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
    '[{"name": "Dr. Carlos Mendez", "image": "https://randomuser.me/api/portraits/men/52.jpg"}, {"name": "Dr. Helen Park", "image": "https://randomuser.me/api/portraits/women/22.jpg"}]'::jsonb,
    '[{"title": "Research Context", "content": "Collaborative robots (cobots) are increasingly used in manufacturing. This research focuses on developing safe and efficient human-robot collaboration strategies for complex assembly tasks.", "image": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&q=80"}, {"title": "Methodology", "content": "We developed a real-time motion planning system that adapts robot behavior based on human movement prediction. Safety was ensured through force limiting and speed monitoring.", "image": "https://images.unsplash.com/photo-1531746790095-e5cb157e5c0a?w=600&q=80"}, {"title": "Results", "content": "The system improved assembly efficiency by 30% while maintaining zero safety incidents in over 1000 hours of collaborative operation.", "image": "https://images.unsplash.com/photo-1563207153-f403bf289096?w=600&q=80"}]'::jsonb,
    '[]'::jsonb
),
(
    'Big Data Analytics for Precision Agriculture',
    'Data Science',
    '2023',
    'precision agriculture, big data, IoT, crop yield',
    'https://images.unsplash.com/photo-1586771107445-145e8f2d3c97?w=800&q=80',
    '[{"name": "Dr. Fatima Al-Rashid", "image": "https://randomuser.me/api/portraits/women/60.jpg"}, {"name": "Dr. Kevin O''Neil", "image": "https://randomuser.me/api/portraits/men/20.jpg"}]'::jsonb,
    '[{"title": "Project Overview", "content": "Precision agriculture uses data-driven techniques to optimize crop production. This research develops a big data analytics platform integrating satellite imagery, IoT sensor data, and weather forecasts.", "image": "https://images.unsplash.com/photo-1586771107445-145e8f2d3c97?w=600&q=80"}, {"title": "Platform Architecture", "content": "We built a cloud-based platform using Apache Spark for processing large-scale agricultural data. Machine learning models predict crop yield, detect diseases, and optimize irrigation.", "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80"}, {"title": "Impact", "content": "Field trials showed 25% increase in crop yield and 30% reduction in water usage across 50 farms in three different climate zones.", "image": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80"}]'::jsonb,
    '[]'::jsonb
),
(
    'Biofuel Production from Algal Biomass',
    'Environmental Biotechnology',
    '2023',
    'biofuel, algae, biomass, renewable energy',
    'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80',
    '[{"name": "Dr. Amara Okafor", "image": "https://randomuser.me/api/portraits/women/42.jpg"}, {"name": "Prof. Hans Mueller", "image": "https://randomuser.me/api/portraits/men/65.jpg"}]'::jsonb,
    '[{"title": "Research Background", "content": "Microalgae offer a promising source of biofuels due to their high lipid content and rapid growth. This research optimizes cultivation and extraction processes for economically viable biofuel production.", "image": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80"}, {"title": "Methods", "content": "We screened over 100 algal strains and optimized growth conditions using photobioreactors. Novel lipid extraction techniques using green solvents were developed.", "image": "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&q=80"}, {"title": "Achievements", "content": "Achieved lipid productivity of 0.5 g/L/day with 90% extraction efficiency, making the process economically competitive with fossil fuels.", "image": "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&q=80"}]'::jsonb,
    '[]'::jsonb
),
(
    'Edge AI for Real-Time Video Analytics',
    'Artificial Intelligence',
    '2023',
    'edge AI, video analytics, real-time, IoT, deep learning',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
    '[{"name": "Dr. Mark Thompson", "image": "https://randomuser.me/api/portraits/men/28.jpg"}, {"name": "Dr. Nina Petrov", "image": "https://randomuser.me/api/portraits/women/38.jpg"}]'::jsonb,
    '[{"title": "Research Overview", "content": "Real-time video analytics on edge devices enables applications in surveillance, autonomous vehicles, and smart cities. This research develops efficient deep learning models for edge deployment.", "image": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80"}, {"title": "Technical Approach", "content": "We developed model compression techniques including pruning, quantization, and knowledge distillation to deploy complex models on resource-constrained devices.", "image": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80"}, {"title": "Results", "content": "Achieved real-time object detection at 60 FPS on Raspberry Pi 4 with 92% accuracy, reducing model size by 90% compared to full-scale models.", "image": "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&q=80"}]'::jsonb,
    '[]'::jsonb
),
(
    '3D Printing of Patient-Specific Medical Implants',
    'Advanced Materials',
    '2023',
    '3D printing, medical implants, biocompatible, patient-specific',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80',
    '[{"name": "Dr. Ahmed Hassan", "image": "https://randomuser.me/api/portraits/men/58.jpg"}, {"name": "Dr. Laura Bennett", "image": "https://randomuser.me/api/portraits/women/31.jpg"}]'::jsonb,
    '[{"title": "Research Context", "content": "Patient-specific medical implants improve surgical outcomes and recovery times. This research develops 3D printing techniques using biocompatible materials for customized implants.", "image": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80"}, {"title": "Methodology", "content": "We used CT/MRI data to design patient-specific implants and developed novel bio-inks for 3D printing. Mechanical testing and biocompatibility studies were conducted.", "image": "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&q=80"}, {"title": "Clinical Impact", "content": "Successfully implanted in 15 patients with 100% survival rate and significantly reduced recovery times compared to standard implants.", "image": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80"}]'::jsonb,
    '[]'::jsonb
),
(
    'Cybersecurity Framework for Industrial IoT Systems',
    'Data Science',
    '2023',
    'cybersecurity, industrial IoT, intrusion detection, blockchain',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
    '[{"name": "Dr. Victor Lee", "image": "https://randomuser.me/api/portraits/men/42.jpg"}, {"name": "Dr. Sophie Martin", "image": "https://randomuser.me/api/portraits/women/54.jpg"}]'::jsonb,
    '[{"title": "Research Overview", "content": "Industrial IoT systems are increasingly targeted by cyberattacks. This research develops a comprehensive cybersecurity framework combining blockchain, machine learning, and cryptographic techniques.", "image": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80"}, {"title": "Framework Design", "content": "We designed a multi-layer security framework with blockchain-based device authentication, ML-based intrusion detection, and secure communication protocols.", "image": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80"}, {"title": "Results", "content": "The framework detected 99.2% of cyberattacks with a false positive rate of 0.5% and added only 50ms latency to industrial control operations.", "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80"}]'::jsonb,
    '[]'::jsonb
);

-- ============================================================
-- SECTION 5: SAMPLE DATA - PROJECTS
-- ============================================================
INSERT INTO projects (title, subtitle, category, tags, team_members, location, description, status, image_url, about_project, project_objectives, content_sections, start_date, end_date, attached_research_ids, link) VALUES
(
    'Smart City Traffic Management System',
    'AI-powered traffic optimization for urban mobility',
    'Artificial Intelligence',
    'smart city, traffic, AI, optimization',
    '[{"name": "Dr. Aditya Singh", "role": "Principal Investigator"}, {"name": "Dr. Sarah Johnson", "role": "Co-Investigator"}, {"name": "Raj Kumar", "role": "Research Assistant"}]'::jsonb,
    'Singapore',
    'Developing an AI-driven traffic management system that reduces congestion and improves urban mobility using real-time data and predictive analytics.',
    'ongoing',
    'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&q=80',
    'This project aims to revolutionize urban traffic management by leveraging artificial intelligence and IoT sensors. The system will predict traffic patterns, optimize signal timings, and provide real-time route recommendations to reduce congestion by up to 40%.',
    '["Reduce traffic congestion by 40% in pilot areas", "Deploy 500+ IoT sensors across the city", "Develop real-time predictive analytics platform", "Integrate with existing traffic infrastructure", "Achieve 95% accuracy in traffic prediction"]'::jsonb,
    '[{"title": "System Architecture", "content": "The system uses a distributed network of IoT sensors, edge computing nodes, and a central AI platform. Real-time data is processed using deep reinforcement learning algorithms.", "image": "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=600&q=80"}, {"title": "Pilot Deployment", "content": "Initial deployment covers 50 intersections in the central business district. Results show 35% reduction in average travel time during peak hours.", "image": "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&q=80"}]'::jsonb,
    '2025-01-15',
    '2027-06-30',
    '[1, 5]'::jsonb,
    'https://example.com/smart-traffic'
),
(
    'Next-Generation Solar Farm Optimization',
    'Maximizing energy output through intelligent panel management',
    'Sustainable Energy',
    'solar energy, optimization, renewable, smart grid',
    '[{"name": "Dr. Emily Rodriguez", "role": "Principal Investigator"}, {"name": "Dr. James Wilson", "role": "Co-Investigator"}]'::jsonb,
    'Arizona, USA',
    'Developing intelligent tracking and cleaning systems for large-scale solar farms to maximize energy generation efficiency.',
    'ongoing',
    'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80',
    'This project focuses on optimizing solar farm operations through AI-driven panel tracking, automated cleaning systems, and predictive maintenance to increase energy output by 25%.',
    '["Increase solar farm efficiency by 25%", "Develop AI-based panel tracking system", "Create automated cleaning robots", "Implement predictive maintenance", "Reduce operational costs by 30%"]'::jsonb,
    '[{"title": "Solar Tracking System", "content": "We developed a dual-axis tracking system using computer vision and weather prediction to optimize panel orientation throughout the day.", "image": "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&q=80"}, {"title": "Cleaning Robots", "content": "Autonomous cleaning robots equipped with sensors navigate solar panels to remove dust and debris, improving efficiency by 15%.", "image": "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&q=80"}]'::jsonb,
    '2025-03-01',
    '2027-12-31',
    '[2]'::jsonb,
    'https://example.com/solar-farm'
),
(
    'Biodegradable Packaging from Agricultural Waste',
    'Converting crop residues into eco-friendly packaging materials',
    'Advanced Materials',
    'biodegradable, packaging, agricultural waste, circular economy',
    '[{"name": "Prof. David Kim", "role": "Principal Investigator"}, {"name": "Dr. Lisa Zhang", "role": "Co-Investigator"}]'::jsonb,
    'California, USA',
    'Transforming agricultural waste into biodegradable packaging materials that can replace single-use plastics in the food industry.',
    'ongoing',
    'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=800&q=80',
    'This project addresses plastic pollution by creating biodegradable packaging from agricultural waste such as rice husks, wheat straw, and corn stalks.',
    '["Develop biodegradable packaging from agricultural waste", "Achieve mechanical properties comparable to conventional plastics", "Ensure full degradation within 90 days", "Scale up production to industrial levels", "Partner with food industry leaders"]'::jsonb,
    '[{"title": "Material Development", "content": "We developed composite materials using cellulose fibers from agricultural waste combined with biodegradable polymers.", "image": "https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=600&q=80"}, {"title": "Industrial Partnership", "content": "Partnered with major food packaging companies for pilot testing of the materials in real-world applications.", "image": "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&q=80"}]'::jsonb,
    '2025-06-01',
    '2028-05-31',
    '[3]'::jsonb,
    'https://example.com/biodegradable-packaging'
),
(
    'Autonomous Warehouse Robotics System',
    'Revolutionizing logistics with intelligent robotic systems',
    'Robotics',
    'warehouse, robotics, automation, logistics, AMR',
    '[{"name": "Dr. Alex Turner", "role": "Principal Investigator"}, {"name": "Maria Santos", "role": "Co-Investigator"}]'::jsonb,
    'Chicago, USA',
    'Designing and deploying a fleet of autonomous mobile robots for warehouse operations including picking, packing, and inventory management.',
    'ongoing',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80',
    'This project develops a complete autonomous warehouse solution using a fleet of collaborative robots with advanced navigation, manipulation, and coordination capabilities.',
    '["Deploy 50 autonomous robots in warehouse", "Achieve 99.5% picking accuracy", "Increase warehouse throughput by 3x", "Develop multi-robot coordination system", "Ensure safe human-robot collaboration"]'::jsonb,
    '[{"title": "Robot Design", "content": "We designed custom AMRs with advanced manipulation capabilities, 360-degree sensing, and autonomous charging.", "image": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&q=80"}, {"title": "Fleet Management", "content": "A centralized AI system coordinates the robot fleet, optimizing task allocation and traffic management in real-time.", "image": "https://images.unsplash.com/photo-1563207153-f403bf289096?w=600&q=80"}]'::jsonb,
    '2024-09-01',
    '2027-08-31',
    '[4, 10]'::jsonb,
    'https://example.com/warehouse-robotics'
),
(
    'Precision Health Monitoring Wearables',
    'Non-invasive health monitoring through advanced sensors',
    'Advanced Materials',
    'wearables, health monitoring, biosensors, IoT',
    '[{"name": "Dr. Yuki Tanaka", "role": "Principal Investigator"}, {"name": "Dr. Rachel Green", "role": "Co-Investigator"}]'::jsonb,
    'Tokyo, Japan',
    'Developing next-generation wearable devices for continuous, non-invasive monitoring of vital signs and biomarkers using advanced nanomaterials.',
    'ongoing',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    'This project creates flexible, skin-like wearable sensors that can continuously monitor glucose, lactate, heart rate, and other health metrics with clinical-grade accuracy.',
    '["Develop flexible biosensor patches", "Achieve clinical-grade accuracy", "Monitor 5+ biomarkers simultaneously", "Ensure 7-day continuous operation", "Complete clinical trials"]'::jsonb,
    '[{"title": "Sensor Development", "content": "We developed graphene-based flexible sensors that can detect biomarkers in sweat with high sensitivity and selectivity.", "image": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80"}, {"title": "Clinical Validation", "content": "Clinical trials with 200 patients show 95% correlation with traditional blood-based measurements.", "image": "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600&q=80"}]'::jsonb,
    '2024-01-01',
    '2026-12-31',
    '[9]'::jsonb,
    'https://example.com/health-wearables'
),
(
    'AI-Powered Crop Disease Detection',
    'Early detection of crop diseases using drone imagery and deep learning',
    'Artificial Intelligence',
    'agriculture, crop disease, drones, deep learning',
    '[{"name": "Dr. Fatima Al-Rashid", "role": "Principal Investigator"}, {"name": "Dr. Kevin O''Neil", "role": "Co-Investigator"}]'::jsonb,
    'Kenya',
    'Using drone-mounted cameras and deep learning algorithms to detect crop diseases at early stages, enabling timely intervention and reducing crop losses.',
    'completed',
    'https://images.unsplash.com/photo-1586771107445-145e8f2d3c97?w=800&q=80',
    'This project deployed drone-based imaging systems combined with deep learning to detect crop diseases in smallholder farms across East Africa.',
    '["Detect 10+ crop diseases with 95% accuracy", "Cover 10,000 hectares of farmland", "Train 500 farmers in using the system", "Reduce crop losses by 30%", "Develop mobile app for farmers"]'::jsonb,
    '[{"title": "Drone Imaging System", "content": "Multispectral cameras mounted on drones capture high-resolution images of crops, which are analyzed by deep learning models.", "image": "https://images.unsplash.com/photo-1586771107445-145e8f2d3c97?w=600&q=80"}, {"title": "Farmer Training", "content": "We trained local farmers to use the system through mobile apps that provide real-time disease alerts and treatment recommendations.", "image": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80"}]'::jsonb,
    '2022-06-01',
    '2024-05-31',
    '[11]'::jsonb,
    'https://example.com/crop-disease'
),
(
    'Smart Water Quality Monitoring Network',
    'Real-time water quality monitoring using IoT sensors',
    'Environmental Biotechnology',
    'water quality, IoT, sensors, environmental monitoring',
    '[{"name": "Dr. Priya Sharma", "role": "Principal Investigator"}, {"name": "Prof. John Miller", "role": "Co-Investigator"}]'::jsonb,
    'Mumbai, India',
    'Deploying a network of IoT sensors for real-time monitoring of water quality in rivers and lakes, enabling early detection of pollution events.',
    'completed',
    'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&q=80',
    'This project deployed 200+ IoT sensors across water bodies in Mumbai to monitor pH, dissolved oxygen, turbidity, and chemical contaminants in real-time.',
    '["Deploy 200+ water quality sensors", "Monitor 10+ water quality parameters", "Provide real-time data to authorities", "Detect pollution events within 1 hour", "Create public dashboard for transparency"]'::jsonb,
    '[{"title": "Sensor Network", "content": "Solar-powered IoT sensors transmit water quality data every 15 minutes to a central cloud platform.", "image": "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&q=80"}, {"title": "Impact", "content": "The system detected 50+ pollution events in the first year, enabling rapid response and reducing water contamination incidents by 60%.", "image": "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&q=80"}]'::jsonb,
    '2022-01-01',
    '2024-12-31',
    '[6]'::jsonb,
    'https://example.com/water-quality'
),
(
    'Multilingual Education Platform for Rural Schools',
    'Bridging the digital divide with AI-powered education',
    'Artificial Intelligence',
    'education, NLP, multilingual, rural, AI',
    '[{"name": "Dr. Wei Chen", "role": "Principal Investigator"}, {"name": "Dr. Sarah O''Brien", "role": "Co-Investigator"}]'::jsonb,
    'Rural India',
    'Developing an AI-powered education platform that provides personalized learning content in multiple regional languages for students in rural areas.',
    'ongoing',
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
    'This project creates a digital learning platform that uses NLP and AI to deliver personalized education content in 15 regional languages to students in underserved rural communities.',
    '["Support 15 regional languages", "Reach 100,000 students", "Improve learning outcomes by 40%", "Develop adaptive learning algorithms", "Provide offline access capability"]'::jsonb,
    '[{"title": "Platform Development", "content": "The platform uses NLP for content translation and adaptation, with AI tutors that personalize learning paths for each student.", "image": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80"}, {"title": "Deployment", "content": "Currently deployed in 500 schools across rural India, serving 50,000 students with plans to expand to 1,000 schools.", "image": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&q=80"}]'::jsonb,
    '2024-03-01',
    '2027-02-28',
    '[7]'::jsonb,
    'https://example.com/education-platform'
),
(
    'Carbon Capture Using Advanced Membranes',
    'Developing efficient membrane technology for carbon capture',
    'Sustainable Energy',
    'carbon capture, membranes, climate change, CO2',
    '[{"name": "Dr. Maria Garcia", "role": "Principal Investigator"}, {"name": "Dr. Thomas Anderson", "role": "Co-Investigator"}]'::jsonb,
    'Norway',
    'Developing novel membrane materials for efficient and cost-effective carbon capture from industrial flue gas emissions.',
    'ongoing',
    'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&q=80',
    'This project develops advanced polymer membranes with embedded nanomaterials for selective CO2 capture from industrial emissions, aiming to reduce capture costs by 50%.',
    '["Develop membranes with 95% CO2 selectivity", "Reduce capture cost by 50%", "Achieve 1000 hours of stable operation", "Scale up to industrial pilot plant", "Partner with cement and steel industries"]'::jsonb,
    '[{"title": "Membrane Development", "content": "We developed mixed-matrix membranes incorporating MOFs and graphene oxide for enhanced CO2 separation performance.", "image": "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=600&q=80"}, {"title": "Pilot Plant", "content": "A pilot plant processing 1 ton of CO2 per day is being constructed at a cement factory in Norway.", "image": "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&q=80"}]'::jsonb,
    '2025-01-01',
    '2028-12-31',
    '[2, 8]'::jsonb,
    'https://example.com/carbon-capture'
),
(
    'Disaster Response Robot System',
    'Robots for search and rescue in disaster zones',
    'Robotics',
    'disaster response, search and rescue, robotics, autonomous',
    '[{"name": "Dr. Carlos Mendez", "role": "Principal Investigator"}, {"name": "Dr. Helen Park", "role": "Co-Investigator"}]'::jsonb,
    'Mexico City, Mexico',
    'Developing a team of specialized robots for search and rescue operations in earthquake-damaged buildings and other disaster scenarios.',
    'completed',
    'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80',
    'This project designed and deployed a multi-robot system for disaster response, including crawling robots for rubble navigation and flying drones for aerial assessment.',
    '["Develop 3 types of rescue robots", "Achieve 90% success rate in victim detection", "Operate in GPS-denied environments", "Withstand extreme temperatures and dust", "Complete field trials with fire department"]'::jsonb,
    '[{"title": "Robot Development", "content": "We developed snake-like robots for navigating tight spaces, tracked robots for rubble traversal, and quadcopters for aerial assessment.", "image": "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&q=80"}, {"title": "Field Trials", "content": "Successful field trials with Mexico City fire department demonstrated the system''s effectiveness in simulated disaster scenarios.", "image": "https://images.unsplash.com/photo-1531746790095-e5cb157e5c0a?w=600&q=80"}]'::jsonb,
    '2022-01-01',
    '2023-12-31',
    '[4]'::jsonb,
    'https://example.com/disaster-robots'
),
(
    'AI-Driven Drug Discovery Platform',
    'Accelerating pharmaceutical research with artificial intelligence',
    'Artificial Intelligence',
    'drug discovery, AI, pharmaceuticals, molecular modeling',
    '[{"name": "Dr. Aditya Singh", "role": "Principal Investigator"}, {"name": "Dr. Michael Chen", "role": "Co-Investigator"}]'::jsonb,
    'Boston, USA',
    'Developing an AI-powered platform for accelerating drug discovery through molecular modeling, virtual screening, and predictive toxicology.',
    'ongoing',
    'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80',
    'This project leverages deep learning and generative AI to dramatically reduce the time and cost of discovering new drug candidates for various diseases.',
    '["Reduce drug discovery time by 60%", "Screen 1 billion compounds virtually", "Identify 100+ drug candidates", "Validate top 10 candidates in lab", "Partner with pharmaceutical companies"]'::jsonb,
    '[{"title": "Platform Architecture", "content": "We built a comprehensive AI platform combining graph neural networks for molecular property prediction, generative models for novel molecule design, and transformer models for protein-ligand interaction prediction.", "image": "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&q=80"}, {"title": "Results", "content": "The platform identified 15 promising drug candidates for cancer and neurodegenerative diseases in just 6 months, compared to the typical 2-3 year timeline.", "image": "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600&q=80"}]'::jsonb,
    '2024-06-01',
    '2027-05-31',
    '[1, 9]'::jsonb,
    'https://example.com/drug-discovery'
),
(
    'Green Hydrogen Production via Electrolysis',
    'Sustainable hydrogen production using renewable energy',
    'Sustainable Energy',
    'green hydrogen, electrolysis, renewable energy, fuel cells',
    '[{"name": "Dr. James Wilson", "role": "Principal Investigator"}, {"name": "Dr. Maria Garcia", "role": "Co-Investigator"}]'::jsonb,
    'Germany',
    'Developing high-efficiency electrolyzers for green hydrogen production using renewable energy sources, enabling cost-competitive clean fuel.',
    'ongoing',
    'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80',
    'This project focuses on developing next-generation electrolyzer technology using advanced catalysts and membranes to produce green hydrogen at costs competitive with fossil fuel-based hydrogen.',
    '["Achieve 85% electrolyzer efficiency", "Reduce green hydrogen cost to $2/kg", "Develop platinum-free catalysts", "Scale up to 10 MW electrolyzer", "Demonstrate 10,000 hour durability"]'::jsonb,
    '[{"title": "Catalyst Development", "content": "We developed novel nickel-iron based catalysts that perform comparably to platinum for water splitting, significantly reducing cost.", "image": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80"}, {"title": "Pilot Plant", "content": "A 1 MW pilot plant is being constructed in Germany, powered by offshore wind, producing 200 kg of hydrogen per day.", "image": "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&q=80"}]'::jsonb,
    '2025-04-01',
    '2028-03-31',
    '[2, 8]'::jsonb,
    'https://example.com/green-hydrogen'
),
(
    'Smart Assistive Technology for Elderly Care',
    'AI-powered systems for independent senior living',
    'Robotics',
    'assistive technology, elderly care, AI, robotics, IoT',
    '[{"name": "Dr. Helen Park", "role": "Principal Investigator"}, {"name": "Dr. Mark Thompson", "role": "Co-Investigator"}]'::jsonb,
    'Seoul, South Korea',
    'Developing intelligent assistive technologies including companion robots and smart home systems to support independent living for elderly individuals.',
    'ongoing',
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80',
    'This project creates a comprehensive ecosystem of assistive technologies including robotic companions, fall detection systems, medication management, and cognitive assistance tools.',
    '["Develop companion robot with emotional AI", "Create fall detection system with 99% accuracy", "Build smart medication management", "Support 10,000 elderly users", "Reduce hospitalization rates by 40%"]'::jsonb,
    '[{"title": "Companion Robot", "content": "We developed a socially assistive robot that can engage in conversation, monitor health, detect emergencies, and provide companionship using advanced NLP and emotion recognition.", "image": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80"}, {"title": "Smart Home Integration", "content": "The system integrates with IoT sensors throughout the home to monitor activity patterns, detect falls, and alert caregivers when necessary.", "image": "https://images.unsplash.com/photo-1558002038-1055907df827?w=600&q=80"}]'::jsonb,
    '2024-07-01',
    '2027-06-30',
    '[10, 13]'::jsonb,
    'https://example.com/elderly-care'
);

-- ============================================================
-- SECTION 6: SAMPLE DATA - PUBLICATIONS
-- ============================================================
INSERT INTO publications (title, authors, year, publication_type, abstract, keywords, journal_conference_name, doi_url, pdf_url, cover_image_url, category, description, tags, image_url) VALUES
(
    'Deep Learning Approaches for Retinal Disease Diagnosis: A Comprehensive Review',
    'Aditya Singh, Sarah Johnson, Michael Chen',
    '2026',
    'Journal Article',
    'This comprehensive review examines the state-of-the-art deep learning approaches for retinal disease diagnosis using fundus imaging. We analyze over 200 papers and provide insights into the most effective architectures, training strategies, and clinical deployment considerations.',
    'deep learning, retinal disease, fundus imaging, CNN, review',
    'IEEE Transactions on Medical Imaging',
    'https://doi.org/10.1000/tmi.2026.123456',
    'https://example.com/papers/retinal-review.pdf',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80',
    'Artificial Intelligence',
    'Comprehensive review of deep learning for retinal disease diagnosis.',
    'deep learning, medical imaging, review',
    'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&q=80'
),
(
    'Perovskite Solar Cells with 26% Efficiency: A Breakthrough in Photovoltaic Technology',
    'Emily Rodriguez, James Wilson, Thomas Anderson',
    '2026',
    'Journal Article',
    'We report a record power conversion efficiency of 26.1% for perovskite solar cells achieved through systematic optimization of the composition and fabrication process. The devices demonstrate enhanced stability, retaining 90% of initial efficiency after 1000 hours.',
    'perovskite, solar cells, efficiency, photovoltaics, stability',
    'Nature Energy',
    'https://doi.org/10.1000/nenergy.2026.789012',
    'https://example.com/papers/perovskite-26.pdf',
    'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&q=80',
    'Sustainable Energy',
    'Record efficiency perovskite solar cells.',
    'solar, perovskite, energy',
    'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&q=80'
),
(
    'Biodegradable Polymer Composites from Agricultural Waste for Sustainable Packaging',
    'David Kim, Lisa Zhang, Raj Patel',
    '2025',
    'Journal Article',
    'We developed biodegradable polymer composites using cellulose fibers extracted from agricultural waste. The materials exhibit mechanical properties comparable to conventional plastics and fully degrade within 90 days under composting conditions.',
    'biodegradable, polymers, agricultural waste, sustainable packaging',
    'ACS Sustainable Chemistry & Engineering',
    'https://doi.org/10.1000/acssus.2025.345678',
    'https://example.com/papers/biodegradable-packaging.pdf',
    'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=400&q=80',
    'Advanced Materials',
    'Biodegradable packaging from agricultural waste.',
    'biodegradable, packaging, sustainability',
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&q=80'
),
(
    'Visual-Inertial SLAM for Autonomous Drone Navigation in GPS-Denied Environments',
    'Alex Turner, Maria Santos, Carlos Mendez',
    '2025',
    'Conference Paper',
    'We present a novel visual-inertial SLAM system combined with deep reinforcement learning for autonomous drone navigation in GPS-denied environments. The system achieves 95% success rate in complex indoor environments.',
    'SLAM, drones, GPS-denied, navigation, reinforcement learning',
    'IEEE International Conference on Robotics and Automation (ICRA)',
    'https://doi.org/10.1000/icra.2025.567890',
    'https://example.com/papers/drone-slam.pdf',
    'https://images.unsplash.com/photo-1508614589041-895f88991d1c?w=400&q=80',
    'Robotics',
    'Autonomous drone navigation system.',
    'drones, SLAM, navigation',
    'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&q=80'
),
(
    'Predictive Maintenance Framework Using Machine Learning for Industrial Equipment',
    'Robert Brown, Anna Kowalski, Victor Lee',
    '2025',
    'Journal Article',
    'We develop a comprehensive predictive maintenance framework using machine learning techniques. The system achieves 94% accuracy in predicting equipment failures 48 hours in advance, reducing unplanned downtime by 60%.',
    'predictive maintenance, machine learning, IoT, industry 4.0',
    'Journal of Manufacturing Systems',
    'https://doi.org/10.1000/jmsy.2025.234567',
    'https://example.com/papers/predictive-maintenance.pdf',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80',
    'Data Science',
    'ML-based predictive maintenance framework.',
    'predictive maintenance, machine learning',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80'
),
(
    'Microbial Fuel Cells for Simultaneous Wastewater Treatment and Electricity Generation',
    'Priya Sharma, John Miller, Amara Okafor',
    '2024',
    'Journal Article',
    'We optimize microbial fuel cell design for practical wastewater treatment applications. The system achieves 92% COD removal efficiency with a maximum power density of 850 mW/m².',
    'microbial fuel cells, wastewater, bioenergy, treatment',
    'Water Research',
    'https://doi.org/10.1000/watres.2024.890123',
    'https://example.com/papers/mfc-wastewater.pdf',
    'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&q=80',
    'Environmental Biotechnology',
    'Microbial fuel cells for wastewater treatment.',
    'MFC, wastewater, bioenergy',
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&q=80'
),
(
    'Multilingual Transfer Learning for Low-Resource Languages',
    'Wei Chen, Sarah O''Brien, Mark Thompson',
    '2024',
    'Conference Paper',
    'We propose a novel multilingual transfer learning framework that improves NLP performance for low-resource languages by leveraging high-resource language models. Translation quality improves by 35% across 10 low-resource languages.',
    'NLP, transfer learning, low-resource languages, machine translation',
    'Annual Meeting of the Association for Computational Linguistics (ACL)',
    'https://doi.org/10.1000/acl.2024.456789',
    'https://example.com/papers/multilingual-nlp.pdf',
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&q=80',
    'Artificial Intelligence',
    'NLP for low-resource languages.',
    'NLP, multilingual, transfer learning',
    'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&q=80'
),
(
    'Reinforcement Learning for Smart Grid Energy Management',
    'Maria Garcia, Thomas Anderson, Emily Rodriguez',
    '2024',
    'Journal Article',
    'We develop a hierarchical reinforcement learning system for optimal energy management in smart grids with high renewable energy penetration. The system reduces curtailment by 40% and maintains 99.5% voltage regulation.',
    'smart grid, reinforcement learning, renewable energy, energy management',
    'IEEE Transactions on Power Systems',
    'https://doi.org/10.1000/tpwrs.2024.123789',
    'https://example.com/papers/smart-grid-rl.pdf',
    'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&q=80',
    'Sustainable Energy',
    'RL for smart grid management.',
    'smart grid, reinforcement learning',
    'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&q=80'
),
(
    'Graphene-Based Flexible Biosensors for Real-Time Health Monitoring',
    'Yuki Tanaka, Rachel Green, Ahmed Hassan',
    '2024',
    'Journal Article',
    'We develop flexible graphene-based biosensors capable of detecting multiple biomarkers in human sweat with high sensitivity. The sensors achieve detection limits as low as 1 fg/mL with response times under 10 minutes.',
    'biosensors, graphene, wearable, health monitoring, nanomaterials',
    'ACS Nano',
    'https://doi.org/10.1000/acsnano.2024.567890',
    'https://example.com/papers/graphene-biosensors.pdf',
    'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&q=80',
    'Advanced Materials',
    'Graphene biosensors for health monitoring.',
    'biosensors, graphene, wearable',
    'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&q=80'
),
(
    'Safe Human-Robot Collaboration: A Real-Time Motion Planning Approach',
    'Carlos Mendez, Helen Park, Alex Turner',
    '2024',
    'Conference Paper',
    'We develop a real-time motion planning system for safe human-robot collaboration in manufacturing. The system adapts robot behavior based on human movement prediction and maintains zero safety incidents while improving efficiency by 30%.',
    'human-robot collaboration, motion planning, safety, manufacturing',
    'IEEE/RSJ International Conference on Intelligent Robots and Systems (IROS)',
    'https://doi.org/10.1000/iros.2024.345678',
    'https://example.com/papers/hrc-safety.pdf',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&q=80',
    'Robotics',
    'Safe human-robot collaboration.',
    'HRC, safety, motion planning',
    'https://images.unsplash.com/photo-1563207153-f403bf289096?w=400&q=80'
),
(
    'Big Data Analytics Platform for Precision Agriculture',
    'Fatima Al-Rashid, Kevin O''Neil, Priya Sharma',
    '2023',
    'Journal Article',
    'We present a cloud-based big data analytics platform for precision agriculture that integrates satellite imagery, IoT sensor data, and weather forecasts. Field trials show 25% increase in crop yield and 30% reduction in water usage.',
    'precision agriculture, big data, IoT, machine learning, crop yield',
    'Computers and Electronics in Agriculture',
    'https://doi.org/10.1000/compag.2023.901234',
    'https://example.com/papers/precision-agriculture.pdf',
    'https://images.unsplash.com/photo-1586771107445-145e8f2d3c97?w=400&q=80',
    'Data Science',
    'Big data for precision agriculture.',
    'precision agriculture, big data',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80'
),
(
    'Optimization of Algal Biofuel Production: From Strain Selection to Scale-Up',
    'Amara Okafor, Hans Mueller, John Miller',
    '2023',
    'Journal Article',
    'We systematically optimize algal biofuel production from strain selection through cultivation to lipid extraction. The optimized process achieves lipid productivity of 0.5 g/L/day with 90% extraction efficiency.',
    'biofuel, algae, biomass, lipid extraction, renewable energy',
    'Biotechnology for Biofuels',
    'https://doi.org/10.1000/biotech.2023.678901',
    'https://example.com/papers/algal-biofuel.pdf',
    'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&q=80',
    'Environmental Biotechnology',
    'Algal biofuel production optimization.',
    'biofuel, algae, renewable',
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&q=80'
),
(
    'Efficient Deployment of Deep Learning Models on Edge Devices for Video Analytics',
    'Mark Thompson, Nina Petrov, Wei Chen',
    '2023',
    'Conference Paper',
    'We develop model compression techniques enabling real-time video analytics on resource-constrained edge devices. Achieves 60 FPS object detection on Raspberry Pi 4 with 92% accuracy, reducing model size by 90%.',
    'edge AI, model compression, video analytics, deep learning',
    'IEEE Conference on Computer Vision and Pattern Recognition (CVPR)',
    'https://doi.org/10.1000/cvpr.2023.234567',
    'https://example.com/papers/edge-ai-video.pdf',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&q=80',
    'Artificial Intelligence',
    'Edge AI for video analytics.',
    'edge AI, model compression',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80'
),
(
    '3D Printed Patient-Specific Implants: From Design to Clinical Application',
    'Ahmed Hassan, Laura Bennett, Yuki Tanaka',
    '2023',
    'Journal Article',
    'We develop a complete workflow for 3D printing patient-specific medical implants using biocompatible materials. Successfully implanted in 15 patients with 100% survival rate and significantly reduced recovery times.',
    '3D printing, medical implants, biocompatible, patient-specific',
    'Biomaterials',
    'https://doi.org/10.1000/biomaterials.2023.890123',
    'https://example.com/papers/3d-printed-implants.pdf',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80',
    'Advanced Materials',
    '3D printed medical implants.',
    '3D printing, medical implants',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80'
),
(
    'Blockchain-Enhanced Cybersecurity Framework for Industrial IoT',
    'Victor Lee, Sophie Martin, Robert Brown',
    '2023',
    'Journal Article',
    'We propose a multi-layer cybersecurity framework combining blockchain, machine learning, and cryptography for industrial IoT systems. The framework detects 99.2% of attacks with 0.5% false positive rate.',
    'cybersecurity, IIoT, blockchain, intrusion detection',
    'IEEE Transactions on Industrial Informatics',
    'https://doi.org/10.1000/tii.2023.456789',
    'https://example.com/papers/iiot-cybersecurity.pdf',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&q=80',
    'Data Science',
    'Cybersecurity for industrial IoT.',
    'cybersecurity, IIoT, blockchain',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80'
),
(
    'Generative Adversarial Networks for Medical Image Synthesis',
    'Michael Chen, Sarah Johnson, Wei Chen',
    '2023',
    'Journal Article',
    'We develop novel GAN architectures for synthesizing high-quality medical images for data augmentation and privacy-preserving sharing. The synthetic images achieve a Frechet Inception Distance of 12.5, approaching real image quality.',
    'GANs, medical imaging, image synthesis, data augmentation',
    'Medical Image Analysis',
    'https://doi.org/10.1000/media.2023.123456',
    'https://example.com/papers/gan-medical.pdf',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80',
    'Artificial Intelligence',
    'GANs for medical image synthesis.',
    'GANs, medical imaging',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80'
);

-- ============================================================
-- SECTION 7: SAMPLE DATA - ACTIVITIES
-- ============================================================
INSERT INTO activities (title, category, year, tags, title_image, content_sections) VALUES
(
    'International Conference on AI and Sustainable Development 2026',
    'Conference',
    '2026',
    'conference, AI, sustainable development, keynote',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    '[{"title": "Event Overview", "content": "Our lab hosted the International Conference on AI and Sustainable Development, bringing together over 500 researchers and industry professionals from 40 countries. The conference featured keynote speeches, paper presentations, and workshops on leveraging AI for sustainable development goals.", "image": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80"}, {"title": "Key Highlights", "content": "Dr. Aditya Singh delivered the opening keynote on ''AI for Social Good''. The conference received 300+ paper submissions, with 80 accepted for presentation. A workshop on ''Responsible AI'' was particularly well-received.", "image": "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&q=80"}]'::jsonb
),
(
    'Workshop on Machine Learning in Healthcare',
    'Workshop',
    '2026',
    'workshop, machine learning, healthcare, medical AI',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    '[{"title": "Workshop Details", "content": "A two-day hands-on workshop on applying machine learning techniques to healthcare challenges. Participants learned about medical image analysis, electronic health record mining, and clinical decision support systems.", "image": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80"}, {"title": "Outcomes", "content": "Over 100 healthcare professionals and researchers attended. The workshop resulted in 5 new collaborative research projects between clinicians and data scientists.", "image": "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&q=80"}]'::jsonb
),
(
    'Lab Annual Symposium 2025: Innovations in Sustainable Technology',
    'Symposium',
    '2025',
    'symposium, sustainable technology, research showcase',
    'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80',
    '[{"title": "Symposium Overview", "content": "Our annual symposium showcased the latest research breakthroughs from all lab groups. Topics ranged from sustainable energy to advanced materials and AI applications. Over 300 people attended including industry partners and academic collaborators.", "image": "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&q=80"}, {"title": "Presentations", "content": "25 research presentations were delivered by lab members, covering topics from perovskite solar cells to biodegradable materials. Three industry partners showcased real-world applications of our research.", "image": "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&q=80"}]'::jsonb
),
(
    'Community Outreach: STEM Education for Rural Schools',
    'Outreach',
    '2025',
    'outreach, STEM, education, rural, community',
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
    '[{"title": "Program Description", "content": "Our lab organized a STEM education outreach program visiting 20 rural schools. We conducted hands-on science demonstrations, robotics workshops, and coding classes for over 2,000 students.", "image": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80"}, {"title": "Impact", "content": "The program inspired many students to pursue STEM careers. Follow-up surveys showed a 60% increase in student interest in science and technology fields.", "image": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&q=80"}]'::jsonb
),
(
    'Research Collaboration Summit with MIT and Stanford',
    'Collaboration',
    '2025',
    'collaboration, summit, research, partnership',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80',
    '[{"title": "Summit Overview", "content": "Our lab hosted a three-day research collaboration summit with MIT and Stanford University. Faculty and researchers from all three institutions discussed joint research initiatives in AI, sustainable energy, and advanced materials.", "image": "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80"}, {"title": "Agreements", "content": "Five joint research projects were initiated, focusing on carbon capture, medical AI, and smart grid technologies. Student exchange programs were also established.", "image": "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80"}]'::jsonb
),
(
    'International Workshop on Nanomaterials for Biomedical Applications',
    'Workshop',
    '2025',
    'nanomaterials, biomedical, workshop, international',
    'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80',
    '[{"title": "Workshop Overview", "content": "An international workshop bringing together leading researchers in nanomaterials and biomedical engineering. Topics included drug delivery systems, biosensors, and tissue engineering using advanced nanomaterials.", "image": "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&q=80"}, {"title": "Participation", "content": "150 researchers from 20 countries participated, including keynote speakers from Nature Nanotechnology and leading universities worldwide.", "image": "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=600&q=80"}]'::jsonb
),
(
    'Lab Achievement: Patent Filed for Novel Solar Cell Design',
    'Achievement',
    '2025',
    'patent, solar cells, innovation, achievement',
    'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80',
    '[{"title": "Patent Details", "content": "Our lab filed a patent for a novel perovskite solar cell design that achieves 26.1% efficiency with enhanced stability. The patent covers the unique composition and fabrication process developed by Dr. Rodriguez and team.", "image": "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&q=80"}, {"title": "Commercial Potential", "content": "Several solar energy companies have expressed interest in licensing the technology. A startup company is being formed to commercialize the innovation.", "image": "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&q=80"}]'::jsonb
),
(
    'Hackathon: AI for Climate Change Solutions',
    'Event',
    '2024',
    'hackathon, AI, climate change, innovation',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80',
    '[{"title": "Hackathon Overview", "content": "Our lab organized a 48-hour hackathon focused on developing AI solutions for climate change challenges. Over 200 participants formed 40 teams to tackle problems in renewable energy, carbon capture, and environmental monitoring.", "image": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80"}, {"title": "Winning Projects", "content": "The winning team developed an AI-powered system for optimizing solar panel placement in urban environments. Second place created a machine learning model for predicting forest fire risks.", "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80"}]'::jsonb
),
(
    'Guest Lecture Series: Distinguished Speakers in Robotics',
    'Lecture',
    '2024',
    'guest lecture, robotics, distinguished speakers',
    'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80',
    '[{"title": "Series Overview", "content": "Our lab hosted a distinguished guest lecture series featuring world-renowned robotics researchers. Speakers from MIT, ETH Zurich, and Carnegie Mellon University presented their latest research.", "image": "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&q=80"}, {"title": "Topics Covered", "content": "Topics included soft robotics, autonomous navigation, human-robot interaction, and swarm robotics. Each lecture was followed by interactive sessions with our lab members.", "image": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&q=80"}]'::jsonb
),
(
    'Field Deployment: Water Quality Monitoring System in Mumbai',
    'Field Work',
    '2024',
    'field deployment, water quality, IoT, Mumbai',
    'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&q=80',
    '[{"title": "Deployment Overview", "content": "Our team deployed 200+ IoT sensors across water bodies in Mumbai for real-time water quality monitoring. The system monitors pH, dissolved oxygen, turbidity, and chemical contaminants.", "image": "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&q=80"}, {"title": "Initial Results", "content": "In the first month, the system detected 5 pollution events and alerted authorities. The data is being used by the municipal corporation for better water management decisions.", "image": "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&q=80"}]'::jsonb
),
(
    'Summer Internship Program 2024',
    'Education',
    '2024',
    'internship, summer, students, research training',
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80',
    '[{"title": "Program Overview", "content": "Our lab hosted 30 undergraduate and graduate students for a 10-week summer internship program. Students worked on research projects under the mentorship of lab faculty and senior researchers.", "image": "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=80"}, {"title": "Projects and Outcomes", "content": "Students contributed to 15 research projects, with 5 resulting in conference papers. The program concluded with a poster session attended by industry partners.", "image": "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=600&q=80"}]'::jsonb
),
(
    'Industry-Academia Meet: Bridging Research and Industry',
    'Collaboration',
    '2024',
    'industry, academia, collaboration, networking',
    'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80',
    '[{"title": "Event Overview", "content": "Our lab organized an industry-academia meet with 50 companies from various sectors including technology, energy, healthcare, and manufacturing. The event facilitated knowledge exchange and collaboration opportunities.", "image": "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&q=80"}, {"title": "Partnerships Formed", "content": "Eight new industry partnerships were established, including a major collaboration with a renewable energy company for solar technology commercialization.", "image": "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&q=80"}]'::jsonb
),
(
    'Research Paper Award: Best Paper at ICRA 2024',
    'Award',
    '2024',
    'award, best paper, ICRA, robotics',
    'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800&q=80',
    '[{"title": "Award Details", "content": "Our lab received the Best Paper Award at the IEEE International Conference on Robotics and Automation (ICRA) 2024 for our work on safe human-robot collaboration. The paper was selected from over 3,000 submissions.", "image": "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=600&q=80"}, {"title": "Recognition", "content": "This is the second consecutive year our lab has received a Best Paper award at a major conference, highlighting our leadership in robotics research.", "image": "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&q=80"}]'::jsonb
),
(
    'Public Lecture: The Future of Artificial Intelligence',
    'Lecture',
    '2023',
    'public lecture, AI, future, community engagement',
    'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80',
    '[{"title": "Lecture Overview", "content": "Dr. Aditya Singh delivered a public lecture on ''The Future of Artificial Intelligence: Opportunities and Challenges'' to an audience of over 500 people including students, professionals, and the general public.", "image": "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&q=80"}, {"title": "Topics Discussed", "content": "The lecture covered recent advances in AI, ethical considerations, impact on jobs, and the role of AI in addressing global challenges. A lively Q&A session followed.", "image": "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&q=80"}]'::jsonb
),
(
    'Lab Retreat 2023: Strategic Planning and Team Building',
    'Retreat',
    '2023',
    'retreat, team building, strategic planning',
    'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=80',
    '[{"title": "Retreat Overview", "content": "Our annual lab retreat brought together all lab members for strategic planning and team building activities. The three-day retreat was held at a mountain resort and included workshops on research direction, collaboration, and career development.", "image": "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&q=80"}, {"title": "Outcomes", "content": "The retreat resulted in a revised 5-year research strategy, formation of new collaborative groups, and strengthened team cohesion. Members rated the retreat 4.8/5 in satisfaction surveys.", "image": "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80"}]'::jsonb
),
(
    'Technology Transfer: AI Software Licensed to Industry Partner',
    'Achievement',
    '2023',
    'technology transfer, licensing, AI, industry',
    'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80',
    '[{"title": "Licensing Details", "content": "Our lab licensed its AI-powered predictive maintenance software to a major manufacturing company. The software, developed by Dr. Brown''s team, will be deployed across 50 factories.", "image": "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&q=80"}, {"title": "Impact", "content": "The technology transfer is expected to generate significant royalty revenue for the lab and demonstrates the practical impact of our research on industry.", "image": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80"}]'::jsonb
);

-- ============================================================
-- SECTION 8: SAMPLE DATA - GALLERY
-- ============================================================
INSERT INTO gallery (title, category, image_url, description) VALUES
('Lab Opening Ceremony', 'Events', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80', 'Grand opening ceremony of our advanced research laboratory with distinguished guests.'),
('Research Team Meeting', 'Lab Life', 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80', 'Weekly research team meeting discussing project progress and new ideas.'),
('Solar Panel Testing Facility', 'Facilities', 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&q=80', 'Our state-of-the-art solar panel testing and characterization facility.'),
('Robotics Lab Tour', 'Lab Life', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&q=80', 'Visitors exploring our robotics laboratory during an open house event.'),
('Conference Presentation', 'Events', 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&q=80', 'Lab member presenting research findings at an international conference.'),
('Student Workshop', 'Education', 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=80', 'Hands-on workshop for undergraduate students on machine learning basics.'),
('Field Work: Water Sampling', 'Field Work', 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&q=80', 'Research team collecting water samples for environmental monitoring project.'),
('3D Printing Lab', 'Facilities', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80', 'Advanced 3D printing facility for prototyping and medical implant fabrication.'),
('Team Building Activity', 'Lab Life', 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&q=80', 'Lab members enjoying a team building outdoor activity.'),
('Drone Flight Test', 'Field Work', 'https://images.unsplash.com/photo-1508614589041-895f88991d1c?w=600&q=80', 'Testing autonomous drone navigation algorithms in an outdoor environment.'),
('Hackathon Event', 'Events', 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80', '48-hour AI hackathon organized by our lab for climate change solutions.'),
('Microscope Training Session', 'Education', 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=600&q=80', 'Training session on advanced microscopy techniques for materials characterization.'),
('Industry Partnership Meeting', 'Collaboration', 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&q=80', 'Meeting with industry partners to discuss technology transfer opportunities.'),
('Poster Session', 'Events', 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=600&q=80', 'Annual research poster session showcasing student projects.'),
('Biosensor Laboratory', 'Facilities', 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&q=80', 'Biosensor development and characterization laboratory facilities.'),
('Lab Anniversary Celebration', 'Events', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&q=80', 'Celebrating 5 years of research excellence at our lab.'),
('International Visitors', 'Collaboration', 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80', 'International research collaborators visiting our laboratory facilities.');

-- ============================================================
-- SECTION 9: SAMPLE DATA - TEAM
-- ============================================================
INSERT INTO team (name, role, description, image_url, social_links) VALUES
('Dr. Aditya Singh', 'Lab Director & Principal Investigator', 'Dr. Aditya Singh is the founder and director of the Advanced Research Laboratory. With over 20 years of research experience, his expertise spans artificial intelligence, sustainable energy, and advanced materials. He has published 150+ papers in top-tier journals and holds 25 patents.', 'https://randomuser.me/api/portraits/men/32.jpg', '{"linkedin": "https://linkedin.com/in/adityasingh", "twitter": "https://twitter.com/adityasingh", "website": "https://adityasingh.researchlab.edu"}'),
('Dr. Sarah Johnson', 'Associate Director of Research', 'Dr. Sarah Johnson leads the AI and Machine Learning research group. Her research focuses on deep learning applications in healthcare and climate science. She has received multiple awards including the NSF CAREER Award.', 'https://randomuser.me/api/portraits/women/44.jpg', '{"linkedin": "https://linkedin.com/in/sarahjohnson", "twitter": "https://twitter.com/sarahjohnson", "website": "https://sarahjohnson.researchlab.edu"}'),
('Dr. Emily Rodriguez', 'Senior Research Scientist', 'Dr. Emily Rodriguez specializes in sustainable energy technologies, particularly perovskite solar cells and energy storage systems. She leads the Sustainable Energy research group and has commercialized two technologies.', 'https://randomuser.me/api/portraits/women/33.jpg', '{"linkedin": "https://linkedin.com/in/emilyrodriguez", "twitter": "https://twitter.com/emilyrodriguez"}'),
('Prof. David Kim', 'Professor of Materials Science', 'Prof. David Kim leads the Advanced Materials research group. His research on biodegradable polymers and nanomaterials has been cited over 20,000 times. He is a Fellow of the Royal Society of Chemistry.', 'https://randomuser.me/api/portraits/men/55.jpg', '{"linkedin": "https://linkedin.com/in/davidkim", "website": "https://davidkim.researchlab.edu"}'),
('Dr. Alex Turner', 'Robotics Research Lead', 'Dr. Alex Turner heads the Robotics and Automation research group. His work on autonomous navigation and human-robot collaboration has been featured in major media outlets. He has led 10+ large-scale robotics projects.', 'https://randomuser.me/api/portraits/men/41.jpg', '{"linkedin": "https://linkedin.com/in/alexturner", "twitter": "https://twitter.com/alexturner"}'),
('Dr. Priya Sharma', 'Environmental Biotechnology Lead', 'Dr. Priya Sharma leads the Environmental Biotechnology research group. Her work on microbial fuel cells and bioremediation has significant practical applications in wastewater treatment and bioenergy production.', 'https://randomuser.me/api/portraits/women/68.jpg', '{"linkedin": "https://linkedin.com/in/priyasharma"}'),
('Dr. Wei Chen', 'NLP Research Lead', 'Dr. Wei Chen leads the Natural Language Processing research group. His work on multilingual NLP and low-resource language processing has been adopted by major technology companies.', 'https://randomuser.me/api/portraits/men/62.jpg', '{"linkedin": "https://linkedin.com/in/weichen", "twitter": "https://twitter.com/weichen"}'),
('Dr. Maria Garcia', 'Smart Grid Research Lead', 'Dr. Maria Garcia leads research on smart grid integration of renewable energy. Her work on reinforcement learning for energy management has been implemented by several utility companies.', 'https://randomuser.me/api/portraits/women/55.jpg', '{"linkedin": "https://linkedin.com/in/mariagarcia", "website": "https://mariagarcia.researchlab.edu"}'),
('Dr. Yuki Tanaka', 'Biosensors Research Lead', 'Dr. Yuki Tanaka leads the Biosensors and Nanomaterials research group. His work on graphene-based biosensors for disease detection has led to multiple patents and a startup company.', 'https://randomuser.me/api/portraits/men/38.jpg', '{"linkedin": "https://linkedin.com/in/yukitanaka"}'),
('Dr. Carlos Mendez', 'Human-Robot Interaction Lead', 'Dr. Carlos Mendez specializes in human-robot interaction and collaborative robotics. His research focuses on developing safe and intuitive interfaces for human-robot collaboration in manufacturing.', 'https://randomuser.me/api/portraits/men/52.jpg', '{"linkedin": "https://linkedin.com/in/carlosmendez", "twitter": "https://twitter.com/carlosmendez"}'),
('Dr. Fatima Al-Rashid', 'Precision Agriculture Lead', 'Dr. Fatima Al-Rashid leads the Precision Agriculture research group. Her work combines AI, IoT, and remote sensing to optimize crop production and reduce resource usage.', 'https://randomuser.me/api/portraits/women/60.jpg', '{"linkedin": "https://linkedin.com/in/fatimaalrashid"}'),
('Dr. Robert Brown', 'Predictive Analytics Lead', 'Dr. Robert Brown leads the Predictive Analytics and Industry 4.0 research group. His work on machine learning for predictive maintenance has been adopted by multiple manufacturing companies.', 'https://randomuser.me/api/portraits/men/48.jpg', '{"linkedin": "https://linkedin.com/in/robertbrown"}'),
('Dr. Laura Bennett', 'Biomaterials Research Lead', 'Dr. Laura Bennett leads the Biomaterials research group, focusing on 3D printing of medical implants and tissue engineering scaffolds. Her work has directly benefited over 50 patients.', 'https://randomuser.me/api/portraits/women/31.jpg', '{"linkedin": "https://linkedin.com/in/laurabennett"}'),
('Dr. Victor Lee', 'Cybersecurity Research Lead', 'Dr. Victor Lee leads the Cybersecurity research group, focusing on securing industrial IoT systems. His multi-layer security framework combining blockchain and ML has been deployed in critical infrastructure.', 'https://randomuser.me/api/portraits/men/42.jpg', '{"linkedin": "https://linkedin.com/in/victorlee", "twitter": "https://twitter.com/victorlee"}'),
('Dr. Amara Okafor', 'Bioenergy Research Lead', 'Dr. Amara Okafor leads the Bioenergy research group, focusing on sustainable biofuel production from algae and waste biomass. Her work contributes to the development of renewable energy alternatives.', 'https://randomuser.me/api/portraits/women/42.jpg', '{"linkedin": "https://linkedin.com/in/amaraokafor"}'),
('Dr. James Wilson', 'Energy Materials Research Lead', 'Dr. James Wilson focuses on developing novel materials for energy applications including solar cells, batteries, and fuel cells. He has published 80+ papers in high-impact journals.', 'https://randomuser.me/api/portraits/men/22.jpg', '{"linkedin": "https://linkedin.com/in/jameswilson"}');

-- ============================================================
-- SECTION 10: SAMPLE DATA - COLLABORATORS
-- ============================================================
INSERT INTO collaborators (company_name, logo_url, image_url, website) VALUES
('TechCorp Industries', 'https://cdn-icons-png.flaticon.com/512/5968/5968872.png', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400&q=80', 'https://techcorp.example.com'),
('GreenEnergy Solutions', 'https://cdn-icons-png.flaticon.com/512/5968/5968872.png', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80', 'https://greenenergy.example.com'),
('BioMed Innovations', 'https://cdn-icons-png.flaticon.com/512/5968/5968872.png', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80', 'https://biomed.example.com'),
('MIT Research Laboratory', NULL, 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&q=80', 'https://mit.edu/lab'),
('Stanford Engineering Center', NULL, 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80', 'https://stanford.edu/engineering'),
('National Science Foundation', 'https://cdn-icons-png.flaticon.com/512/5968/5968872.png', NULL, 'https://nsf.gov'),
('Advanced Materials Corp', 'https://cdn-icons-png.flaticon.com/512/5968/5968872.png', 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&q=80', 'https://amc.example.com'),
('RoboDynamics Inc.', 'https://cdn-icons-png.flaticon.com/512/5968/5968872.png', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&q=80', 'https://robodynamics.example.com'),
('CleanWater Tech', 'https://cdn-icons-png.flaticon.com/512/5968/5968872.png', 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&q=80', 'https://cleanwater.example.com'),
('DataSmart Analytics', 'https://cdn-icons-png.flaticon.com/512/5968/5968872.png', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80', 'https://datasmart.example.com'),
('SolarTech International', 'https://cdn-icons-png.flaticon.com/512/5968/5968872.png', 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&q=80', 'https://solartech.example.com'),
('Oxford University Research Lab', NULL, 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&q=80', 'https://oxford.ac.uk/research'),
('Tokyo Institute of Technology', NULL, 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80', 'https://titech.ac.jp'),
('ETH Zurich', NULL, 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&q=80', 'https://ethz.ch'),
('World Health Organization', 'https://cdn-icons-png.flaticon.com/512/5968/5968872.png', NULL, 'https://who.int'),
('United Nations Development Programme', 'https://cdn-icons-png.flaticon.com/512/5968/5968872.png', NULL, 'https://undp.org');

-- ============================================================
-- SECTION 11: SAMPLE DATA - PEOPLE
-- ============================================================
INSERT INTO people (full_name, role_designation, profile_image, nationality, lab_id, education_background, past_teaching_background, publications, cv_url, research_topic, linkedin_url, position) VALUES
('Dr. Aditya Singh', 'Professor', 'https://randomuser.me/api/portraits/men/32.jpg', 'Indian', 'LAB-001', 'Ph.D. in Computer Science, MIT; M.Tech in AI, IIT Bombay; B.Tech in Computer Science, IIT Delhi', 'Professor at Stanford University (2010-2020); Visiting Professor at Cambridge University (2015)', '[{"link": "https://doi.org/10.1000/journal1"}, {"link": "https://doi.org/10.1000/journal2"}]'::jsonb, 'https://example.com/cv/adityasingh.pdf', 'Artificial Intelligence for Healthcare and Sustainability', 'https://linkedin.com/in/adityasingh', 1),
('Dr. Sarah Johnson', 'Professor', 'https://randomuser.me/api/portraits/women/44.jpg', 'American', 'LAB-002', 'Ph.D. in Computer Science, Stanford; M.S. in AI, Stanford; B.S. in Computer Science, UC Berkeley', 'Associate Professor at Stanford (2015-2021); Assistant Professor at MIT (2010-2015)', '[{"link": "https://doi.org/10.1000/journal3"}]'::jsonb, 'https://example.com/cv/sarahjohnson.pdf', 'Deep Learning for Medical Imaging', 'https://linkedin.com/in/sarahjohnson', 2),
('Dr. Emily Rodriguez', 'Professor', 'https://randomuser.me/api/portraits/women/33.jpg', 'Spanish', 'LAB-003', 'Ph.D. in Materials Science, Cambridge; M.S. in Energy Engineering, TU Delft; B.S. in Physics, University of Barcelona', 'Professor at Cambridge University (2012-2022); Postdoctoral Researcher at Stanford', NULL, 'https://example.com/cv/emilyrodriguez.pdf', 'Perovskite Solar Cells and Energy Storage', 'https://linkedin.com/in/emilyrodriguez', 3),
('Prof. David Kim', 'Professor', 'https://randomuser.me/api/portraits/men/55.jpg', 'South Korean', 'LAB-004', 'Ph.D. in Materials Science, MIT; M.S. in Polymer Science, Seoul National University; B.S. in Chemistry, KAIST', 'Distinguished Professor at MIT (2008-2021); Department Chair at MIT Materials Science', '[{"link": "https://doi.org/10.1000/journal4"}]'::jsonb, 'https://example.com/cv/davidkim.pdf', 'Biodegradable Polymers and Nanomaterials', 'https://linkedin.com/in/davidkim', 4),
('Dr. Alex Turner', 'Professor', 'https://randomuser.me/api/portraits/men/41.jpg', 'British', 'LAB-005', 'Ph.D. in Robotics, Oxford; M.S. in Control Systems, Imperial College; B.S. in Mechanical Engineering, Cambridge', 'Professor at Oxford (2013-2022); Research Scientist at Boston Dynamics', NULL, 'https://example.com/cv/alexturner.pdf', 'Autonomous Navigation and Human-Robot Collaboration', 'https://linkedin.com/in/alexturner', 5),
('Dr. Priya Sharma', 'Associate Professor', 'https://randomuser.me/api/portraits/women/68.jpg', 'Indian', 'LAB-006', 'Ph.D. in Environmental Engineering, IIT Madras; M.Tech in Biotechnology, IIT Kharagpur; B.Tech in Chemical Engineering, IIT Roorkee', 'Associate Professor at IIT Madras (2015-2023); Postdoctoral Researcher at University of Queensland', NULL, 'https://example.com/cv/priyasharma.pdf', 'Microbial Fuel Cells and Wastewater Treatment', 'https://linkedin.com/in/priyasharma', 6),
('Dr. Wei Chen', 'Associate Professor', 'https://randomuser.me/api/portraits/men/62.jpg', 'Chinese', 'LAB-007', 'Ph.D. in Computational Linguistics, CMU; M.S. in Computer Science, Peking University; B.S. in Mathematics, Tsinghua University', 'Associate Professor at CMU (2014-2022); Research Scientist at Google AI', NULL, 'https://example.com/cv/weichen.pdf', 'Multilingual NLP and Machine Translation', 'https://linkedin.com/in/weichen', 7),
('Dr. Maria Garcia', 'Associate Professor', 'https://randomuser.me/api/portraits/women/55.jpg', 'Mexican', 'LAB-008', 'Ph.D. in Electrical Engineering, Stanford; M.S. in Power Systems, UNAM; B.S. in Electrical Engineering, UNAM', 'Associate Professor at Stanford (2010-2020); Research Engineer at Siemens', NULL, 'https://example.com/cv/mariagarcia.pdf', 'Smart Grid and Renewable Energy Integration', 'https://linkedin.com/in/mariagarcia', 8),
('Dr. Yuki Tanaka', 'Assistant Professor', 'https://randomuser.me/api/portraits/men/38.jpg', 'Japanese', 'LAB-009', 'Ph.D. in Nanotechnology, University of Tokyo; M.S. in Materials Science, Tokyo Institute of Technology; B.S. in Physics, University of Tokyo', 'Postdoctoral Researcher at Cambridge (2019-2022); Research Scientist at Sony', NULL, 'https://example.com/cv/yukitanaka.pdf', 'Graphene Biosensors for Healthcare', 'https://linkedin.com/in/yukitanaka', 9),
('Dr. Carlos Mendez', 'Assistant Professor', 'https://randomuser.me/api/portraits/men/52.jpg', 'Mexican', 'LAB-010', 'Ph.D. in Robotics, ETH Zurich; M.S. in Mechanical Engineering, TU Munich; B.S. in Mechatronics, ITESM', 'Postdoctoral Researcher at MIT (2018-2021)', NULL, 'https://example.com/cv/carlosmendez.pdf', 'Human-Robot Collaboration in Manufacturing', 'https://linkedin.com/in/carlosmendez', 10),
('Dr. Fatima Al-Rashid', 'Assistant Professor', 'https://randomuser.me/api/portraits/women/60.jpg', 'Emirati', 'LAB-011', 'Ph.D. in Agricultural Engineering, UC Davis; M.S. in Data Science, NYU; B.S. in Computer Engineering, Khalifa University', 'Postdoctoral Researcher at Cornell (2017-2020)', NULL, 'https://example.com/cv/fatimaalrashid.pdf', 'AI-Driven Precision Agriculture', 'https://linkedin.com/in/fatimaalrashid', 11),
('Dr. Robert Brown', 'Assistant Professor', 'https://randomuser.me/api/portraits/men/48.jpg', 'American', 'LAB-012', 'Ph.D. in Industrial Engineering, Georgia Tech; M.S. in Statistics, University of Michigan; B.S. in Mathematics, UCLA', 'Research Scientist at GE (2016-2021)', '[{"link": "https://doi.org/10.1000/journal5"}]'::jsonb, 'https://example.com/cv/robertbrown.pdf', 'Predictive Maintenance and Industry 4.0', 'https://linkedin.com/in/robertbrown', 12),
('Raj Kumar', 'Graduate Student', 'https://randomuser.me/api/portraits/men/45.jpg', 'Indian', 'LAB-001', 'M.Tech in AI, IIT Bombay (Current); B.Tech in Computer Science, NIT Trichy', NULL, NULL, NULL, 'Deep Learning for Medical Image Analysis', 'https://linkedin.com/in/rajkumar', 13),
('Maria Santos', 'Graduate Student', 'https://randomuser.me/api/portraits/women/50.jpg', 'Portuguese', 'LAB-005', 'Ph.D. in Robotics, Current; M.S. in Mechanical Engineering, University of Lisbon; B.S. in Mechanical Engineering, University of Porto', NULL, NULL, NULL, 'Autonomous Drone Navigation', 'https://linkedin.com/in/mariasantos', 14),
('Lisa Zhang', 'Graduate Student', 'https://randomuser.me/api/portraits/women/28.jpg', 'Chinese', 'LAB-004', 'Ph.D. in Materials Science, Current; M.S. in Polymer Engineering, Zhejiang University; B.S. in Chemistry, Fudan University', NULL, NULL, NULL, 'Biodegradable Polymer Composites', 'https://linkedin.com/in/lisazhang', 15),
('James Wilson', 'Graduate Student', 'https://randomuser.me/api/portraits/men/22.jpg', 'Australian', 'LAB-003', 'Ph.D. in Energy Materials, Current; M.S. in Renewable Energy, ANU; B.S. in Physics, University of Sydney', NULL, NULL, NULL, 'Perovskite Solar Cell Optimization', 'https://linkedin.com/in/jameswilson', 16),
('Michael Chen', 'Graduate Student', 'https://randomuser.me/api/portraits/men/45.jpg', 'Taiwanese', 'LAB-002', 'Ph.D. in Computer Science, Current; M.S. in AI, National Taiwan University; B.S. in Computer Science, National Tsing Hua University', NULL, NULL, NULL, 'Generative Models for Medical Imaging', 'https://linkedin.com/in/michaelchen', 17),
('Nina Petrov', 'Graduate Student', 'https://randomuser.me/api/portraits/women/38.jpg', 'Bulgarian', 'LAB-001', 'Ph.D. in Computer Science, Current; M.S. in Data Science, Sofia University; B.S. in Mathematics, Sofia University', NULL, NULL, NULL, 'Edge AI and Model Compression', 'https://linkedin.com/in/ninapetrov', 18),
('Sophie Martin', 'Graduate Student', 'https://randomuser.me/api/portraits/women/54.jpg', 'French', 'LAB-012', 'Ph.D. in Cybersecurity, Current; M.S. in Network Security, Telecom Paris; B.S. in Computer Science, University of Lyon', NULL, NULL, NULL, 'Blockchain Security for IIoT', 'https://linkedin.com/in/sophiemartin', 19),
('Anna Kowalski', 'Graduate Student', 'https://randomuser.me/api/portraits/women/26.jpg', 'Polish', 'LAB-012', 'Ph.D. in Data Science, Current; M.S. in Statistics, University of Warsaw; B.S. in Mathematics, Jagiellonian University', NULL, NULL, NULL, 'Predictive Analytics for Manufacturing', 'https://linkedin.com/in/annakowalski', 20);

-- ============================================================
-- SECTION 12: SAMPLE DATA - MESSAGES (for testing)
-- ============================================================
INSERT INTO messages (name, email, subject, message, is_read) VALUES
('Alice Johnson', 'alice@example.com', 'Collaboration Inquiry', 'Hello, I am interested in collaborating with your lab on AI for healthcare projects. Please let me know the process for establishing a research collaboration.', FALSE),
('Bob Smith', 'bob@example.com', 'PhD Application Question', 'I am applying for the PhD program and wanted to know more about the research opportunities in sustainable energy. Could you provide more details?', TRUE),
('Carol Williams', 'carol@example.com', 'Industry Partnership', 'Our company is looking for partners in developing smart grid solutions. We would like to explore potential collaboration with your lab.', FALSE),
('David Brown', 'david@example.com', 'Visiting Scholar Request', 'I am a professor from Brazil interested in spending a sabbatical year at your lab. Please share information about the visiting scholar program.', TRUE),
('Eva Martinez', 'eva@example.com', 'Equipment Donation Offer', 'Our company would like to donate advanced microscopy equipment to your lab. Please contact me to discuss the details.', FALSE),
('Frank Lee', 'frank@example.com', 'Media Interview Request', 'I am a journalist from Tech Magazine and would like to schedule an interview with Dr. Singh about the lab''s latest research breakthroughs.', TRUE),
('Grace Chen', 'grace@example.com', 'Summer Internship Inquiry', 'I am a undergraduate student looking for summer internship opportunities at your lab. Could you share information about the application process?', FALSE),
('Henry Taylor', 'henry@example.com', 'Conference Sponsorship', 'Our organization would like to sponsor your upcoming conference on AI and Sustainable Development. Please send sponsorship packages.', TRUE),
('Iris Nakamura', 'iris@example.com', 'Research Paper Submission', 'I would like to submit my research paper for consideration in your lab''s upcoming journal special issue. Could you provide submission guidelines?', FALSE),
('Jack Wilson', 'jack@example.com', 'Software Licensing Interest', 'Our manufacturing company is interested in licensing your predictive maintenance software. Please provide information about licensing terms.', TRUE),
('Karen O''Brien', 'karen@example.com', 'Graduate Program Inquiry', 'I am completing my Master''s degree and interested in pursuing PhD research in nanomaterials for biomedical applications.', FALSE),
('Luis Hernandez', 'luis@example.com', 'Workshop Registration', 'I would like to register for the upcoming workshop on Machine Learning in Healthcare. Please send registration details.', TRUE),
('Maya Patel', 'maya@example.com', 'Donation to Lab Fund', 'I would like to make a donation to support the lab''s research on clean energy. Please share information about how to contribute.', FALSE),
('Nathan Anderson', 'nathan@example.com', 'Technology Transfer Inquiry', 'Our startup is interested in commercializing your biosensor technology. We would like to discuss technology transfer options.', TRUE),
('Olivia Thompson', 'olivia@example.com', 'Joint Research Proposal', 'I am from the University of Tokyo and we would like to submit a joint research proposal on smart city technologies.', FALSE);

-- ============================================================
-- SECTION 13: SAMPLE DATA - ADMIN USERS (for testing)
-- ============================================================
-- Default admin user (username: admin, password: admin123)
-- Password hash uses bcrypt
INSERT INTO admin_users (username, password_hash) VALUES
('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy');
