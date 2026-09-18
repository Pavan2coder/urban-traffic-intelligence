import streamlit as st
import pandas as pd
import folium
from streamlit_folium import st_folium
import requests 
import datetime 

st.set_page_config(page_title="Urban Traffic Intelligence", page_icon="🚦", layout="wide")
BACKEND_URL = "http://127.0.0.1:8000" 

# Inject Baloo 2 Google Font
st.markdown("""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800&display=swap');
    html, body, [class*="css"], h1, h2, h3, h4, h5, h6, .stMarkdown {
        font-family: 'Baloo 2', cursive, sans-serif !important;
    }
    </style>
""", unsafe_allow_html=True)

if 'show_chart' not in st.session_state: st.session_state.show_chart = False
if 'show_map' not in st.session_state: st.session_state.show_map = False

# ==========================================
# SIDEBAR
# ==========================================
with st.sidebar:
    st.header("📍 Navigation Settings")
    st.caption("💡 Tip: Click the box and start typing to search!")
    
    # All 50 locations sorted alphabetically
    locations = sorted([
        "Abids", "Alwal", "Amberpet", "Ameerpet", "Attapur", "Bachupally", 
        "Banjara Hills", "Begumpet", "Bolarum", "Bowenpally", "Chanda Nagar", 
        "Charminar", "Dilsukhnagar", "Gachibowli", "Ghatkesar", "Habsiguda", 
        "Hafeezpet", "Hayathnagar", "Hitech City", "JNTU", "Jubilee Hills", 
        "Khairatabad", "Kompally", "Kondapur", "Koti", "Kukatpally", 
        "LB Nagar", "Lakdikapul", "Lingampally", "Madhapur", "Malkajgiri", 
        "Masab Tank", "Medchal", "Mehdipatnam", "Miyapur", "Nacharam", 
        "Nampally", "Nizampet", "Panjagutta", "Paradise", "Pragathi Nagar", 
        "Raidurg", "Ramanthapur", "Sainikpuri", "Secunderabad Station", 
        "Shamirpet", "Tarnaka", "Gandimaissama", "Uppal X Roads", "Yapral"
    ])
    
    source = st.selectbox("Source Location", locations, index=locations.index("Alwal"))
    destination = st.selectbox("Destination Location", locations, index=locations.index("Secunderabad Station"))
    
    hour = st.slider("Time (24hr)", 0, 23, 14)
    weather = st.selectbox("Weather", ["Clear", "Rainy", "Foggy"])
    
    st.markdown("---")
    
    if st.button("📊 Predict Traffic"):
        st.session_state.show_chart = True 
    
    if st.button("🚀 Find Best Route"):
        st.session_state.show_map = True

# ==========================================
# MAIN DASHBOARD
# ==========================================
st.markdown("""
    <div style="background: linear-gradient(135deg, #6366f1, #06b6d4); padding: 12px 20px; border-radius: 12px; margin-bottom: 20px; color: white;">
        <h4 style="margin:0; color: white;">✨ Modern React Bits Web App is Live!</h4>
        <p style="margin: 4px 0 0 0; font-size: 0.9rem;">Open <a href="http://localhost:5173" target="_blank" style="color: #ffffff; font-weight: bold; text-decoration: underline;">http://localhost:5173</a> in your browser for the full interactive UI with Framer Motion animations & glowing cards.</p>
    </div>
""", unsafe_allow_html=True)

st.title("🚦 AI-Powered Urban Traffic Intelligence")
st.divider()

col1, col2 = st.columns(2)

# --- COLUMN 1: AI PREDICTION ---
with col1:
    st.subheader("📊 Traffic Prediction")
    
    if st.session_state.show_chart:
        try:
            with st.spinner("Connecting to AI Brain..."):
                payload = {"source": source, "destination": destination, "hour": hour, "weather": weather}
                response = requests.post(f"{BACKEND_URL}/traffic/predict", json=payload)
                
                if response.status_code == 200:
                    data = response.json()
                    congestion = data["congestion_level"]
                    status = data["status"]
                    
                    st.metric("Congestion Level", f"{congestion}%", status)
                    st.progress(congestion)
                    
                    if congestion > 60:
                        st.error(f"⚠️ High Traffic detected! Estimated delay: {data.get('estimated_time', 45)} mins.")
                    else:
                        st.success(f"✅ Route Clear. Estimated time: {data.get('estimated_time', 25)} mins.")
                    
                    st.markdown("### 📈 Daily Traffic Trend")
                    
                    base_trend = [15, 10, 10, 15, 25, 40, 60, 85, 95, 80, 60, 55, 55, 60, 65, 75, 85, 95, 85, 65, 45, 35, 25, 20]
                    
                    if weather in ["Rainy", "Foggy"]:
                        base_trend = [min(100, t + 15) for t in base_trend] 
                        
                    # Make the graph dynamic by anchoring it to the AI prediction
                    dynamic_trend = [max(0, min(100, t + (congestion - 50))) for t in base_trend]
                    
                    chart_data = pd.DataFrame(
                        {"Congestion (%)": dynamic_trend}, 
                        index=list(range(24)) 
                    )
                    
                    st.area_chart(chart_data, color="#FF4B4B") 
                    
                else:
                    st.error("Backend API Error.")
        except Exception as e:
            st.error(f"Connection Failed: Ensure Backend is running. ({e})")
    else:
        st.info("Click **Predict Traffic** in the sidebar to analyze congestion.")

# --- COLUMN 2: MAP AND ETA ---
with col2:
    st.subheader("🗺️ Route Optimization Map")
    if st.session_state.show_map:
        try:
            with st.spinner("Calculating Shortest Path & ETA..."):
                payload = {"source": source, "destination": destination, "hour": hour}
                response = requests.post(f"{BACKEND_URL}/route/best", json=payload)
                
                if response.status_code == 200:
                    data = response.json()
                    path_coords = data["path_coords"] 
                    total_km = data["total_distance"]
                    est_mins = data["estimated_minutes"] 
                    route_text = " ➝ ".join(data["best_route"])
                    
                    # Time Clock Math
                    depart_time = datetime.datetime.strptime(f"{hour}:00", "%H:%M")
                    arrive_time = depart_time + datetime.timedelta(minutes=est_mins)
                    
                    depart_str = depart_time.strftime("%I:%M %p")
                    arrive_str = arrive_time.strftime("%I:%M %p")
                    
                    # Display Results
                    st.success(f"**Optimal Route:** {route_text}")
                    st.info(f"📏 **Distance:** {total_km} km | ⏳ **Travel Time:** {est_mins} mins")
                    st.markdown(f"### 🕒 Depart: `{depart_str}` ➔ 🎯 Arrive: `{arrive_str}`")
                    
                    # Draw Map
                    start_loc = path_coords[0]
                    m = folium.Map(location=start_loc, zoom_start=12)
                    
                    folium.Marker(path_coords[0], popup="Start", icon=folium.Icon(color="green")).add_to(m)
                    folium.Marker(path_coords[-1], popup="Destination", icon=folium.Icon(color="red")).add_to(m)
                    folium.PolyLine(path_coords, color="blue", weight=5, opacity=0.8).add_to(m)
                    
                    st_folium(m, width=700, height=400)
                else:
                    st.error("Route not found. Try different locations.")
        except Exception as e:
            st.error(f"Map Rendering Error: {e}")
    else:
        st.info("Click **Find Best Route** in the sidebar to visualize the path.")