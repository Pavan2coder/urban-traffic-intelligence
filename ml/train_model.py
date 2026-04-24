import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import joblib
import os

print("🚦 Starting Mega 50-Junction AI Training Process...")

# ==========================================
# 1. VERIFY DATASET EXISTS
# ==========================================
csv_path = "ml/traffic.csv"
if not os.path.exists(csv_path):
    print(f"❌ ERROR: Cannot find '{csv_path}'.")
    print("Please make sure you put traffic.csv inside the 'ml' folder.")
    exit()

# ==========================================
# 2. LOAD & CLEAN THE BASE DATASET
# ==========================================
print("⏳ 1/5: Loading traffic.csv...")
base_df = pd.read_csv(csv_path)

# Filter to just one junction to act as our baseline
base_df = base_df[base_df['Junction'] == 1].copy()

# ✅ THE FIX: Convert to DateTime FIRST, then extract Hour and Day safely
base_df['DateTime'] = pd.to_datetime(base_df['DateTime'])
base_df['Hour'] = base_df['DateTime'].dt.hour
base_df['Day'] = base_df['DateTime'].dt.dayofweek # 0=Monday, 6=Sunday

# Drop columns we no longer need
base_df = base_df.drop(['Junction', 'ID', 'DateTime'], axis=1, errors='ignore')

# ==========================================
# 3. DEFINE THE 50 HYDERABAD LOCATIONS
# ==========================================
print("⏳ 2/5: Creating 50 Hyderabad Junctions...")

high_traffic = [
    "Hitech City", "Gachibowli", "Kukatpally", "Madhapur", "Jubilee Hills",
    "Banjara Hills", "Panjagutta", "Ameerpet", "Begumpet", "Secunderabad Station",
    "Kondapur", "Miyapur", "JNTU", "Raidurg", "Mehdipatnam",
    "Lakdikapul", "Khairatabad", "Charminar", "Koti", "Abids",
    "Dilsukhnagar", "LB Nagar", "Uppal X Roads", "Tarnaka", "Paradise"
]

medium_traffic = [
    "Bachupally", "Nizampet", "Pragathi Nagar", "Chanda Nagar", "Hafeezpet",
    "Lingampally", "Nampally", "Masab Tank", "Badhurpally", "Attapur",
    "Amberpet", "Gandimaissama", "Habsiguda", "Nacharam", "Malkajgiri"
]

low_traffic = [
    "Bowenpally", "Alwal", "Sainikpuri", "Yapral", "Bolarum",
    "Kompally", "Medchal", "Shamirpet", "Ghatkesar", "Doolapally"
]

# ==========================================
# 4. EXPAND DATASET & APPLY LOGIC
# ==========================================
expanded_data = []

# Function to copy data and apply a base multiplier
def expand_data(locations, multiplier):
    for loc in locations:
        temp_df = base_df.copy()
        temp_df['Location'] = loc
        # Add random noise (0.9 to 1.1) so every city has unique traffic
        noise = np.random.uniform(0.9, 1.1, size=len(temp_df))
        temp_df['Vehicles'] = temp_df['Vehicles'] * multiplier * noise
        expanded_data.append(temp_df)

expand_data(high_traffic, 1.8)   # Boost high traffic areas
expand_data(medium_traffic, 1.2) # Boost medium traffic areas
expand_data(low_traffic, 0.6)    # Reduce low traffic areas

final_df = pd.concat(expanded_data, ignore_index=True)

# Add strict Hyderabad Rush Hour logic
def apply_rush_hours(row):
    v = row['Vehicles']
    if 8 <= row['Hour'] <= 10: v *= 1.4     # Morning rush
    elif 17 <= row['Hour'] <= 21: v *= 1.6  # Evening rush
    if row['Day'] == 6: v *= 0.6            # Less traffic on Sunday
    return int(v)

final_df['Vehicles'] = final_df.apply(apply_rush_hours, axis=1)

# ==========================================
# 5. ENCODE TEXT TO NUMBERS
# ==========================================
print("⏳ 3/5: Encoding text data to numbers...")
le = LabelEncoder()
final_df['Location_Code'] = le.fit_transform(final_df['Location'])

# ==========================================
# 6. TRAIN THE AI MODEL
# ==========================================
print(f"⏳ 4/5: Training AI Brain on {len(final_df)} rows... (This will take 30-60 seconds)")
X = final_df[['Hour', 'Day', 'Location_Code']]
y = final_df['Vehicles']

# Split data: 80% training, 20% testing
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train Random Forest
model = RandomForestRegressor(n_estimators=50, random_state=42, n_jobs=-1)
model.fit(X_train, y_train)

# Calculate Accuracy Score
score = model.score(X_test, y_test)
print(f"✅ Model Accuracy (R2 Score): {score:.4f}")

# ==========================================
# 7. SAVE THE MODEL FILES
# ==========================================
print("⏳ 5/5: Saving AI models...")
joblib.dump(model, "ml/traffic_model.pkl")
joblib.dump(le, "ml/junction_mapping.pkl")

print(f"\n🎉 MEGA SUCCESS! AI trained on all {len(high_traffic) + len(medium_traffic) + len(low_traffic)} junctions.")
print("✅ Saved: ml/traffic_model.pkl")
print("✅ Saved: ml/junction_mapping.pkl")