import torch
import torch.nn as nn
from typing import Dict, List
import os

class DQNModel(nn.Module):
    """Deep Q-Network model for anomaly detection"""
    def __init__(self, input_dim: int = 51, hidden_dim: int = 128, output_dim: int = 2):
        super(DQNModel, self).__init__()
        self.network = nn.Sequential(
            nn.Linear(input_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, output_dim)
        )
    
    def forward(self, x):
        return self.network(x)

class ModelInference:
    """Handle model loading and inference"""
    
    def __init__(self, model_path: str = None):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = None
        
        if model_path is None:
            # Default path to the model
            model_path = os.path.join(os.path.dirname(__file__), "../../..", "swat_fdai_model_final.pth")
        
        self.load_model(model_path)
    
    def load_model(self, model_path: str):
        """Load the trained PyTorch model"""
        try:
            # Initialize model architecture
            self.model = DQNModel()
            
            # Load model weights
            if os.path.exists(model_path):
                checkpoint = torch.load(model_path, map_location=self.device)
                self.model.load_state_dict(checkpoint)
                self.model.to(self.device)
                self.model.eval()
                print(f"Model loaded successfully from {model_path}")
            else:
                print(f"Warning: Model file not found at {model_path}")
                print("Using untrained model for demo purposes")
        except Exception as e:
            print(f"Error loading model: {e}")
            print("Using untrained model for demo purposes")
    
    def predict(self, sensor_data: Dict) -> Dict:
        """
        Make predictions on sensor data
        
        Args:
            sensor_data: Dictionary containing sensor readings
            
        Returns:
            Dictionary with anomaly predictions and topology
        """
        try:
            # Convert sensor data to tensor (adjust based on your actual data format)
            # This is a placeholder - adjust according to your actual sensor data structure
            input_tensor = self._preprocess_data(sensor_data)
            
            with torch.no_grad():
                output = self.model(input_tensor)
                predictions = torch.softmax(output, dim=-1)
            
            # Process predictions (placeholder logic)
            anomalies = self._process_predictions(predictions, sensor_data)
            topology = self._generate_topology(anomalies)
            
            return {
                "anomalies": anomalies,
                "topology": topology
            }
        except Exception as e:
            print(f"Prediction error: {e}")
            return {
                "anomalies": [],
                "topology": {"nodes": [], "edges": []}
            }
    
    def _preprocess_data(self, sensor_data: Dict) -> torch.Tensor:
        """Preprocess sensor data for model input"""
        # Placeholder - adjust based on your actual data format
        # Assuming 51 features as per the model
        values = list(sensor_data.values())[:51]
        while len(values) < 51:
            values.append(0.0)
        
        tensor = torch.tensor(values, dtype=torch.float32).unsqueeze(0)
        return tensor.to(self.device)
    
    def _process_predictions(self, predictions: torch.Tensor, sensor_data: Dict) -> List[Dict]:
        """Process model predictions into anomaly list"""
        # Placeholder logic
        anomalies = []
        
        # Example: if anomaly probability > threshold
        anomaly_prob = predictions[0][1].item()  # Assuming index 1 is anomaly class
        
        if anomaly_prob > 0.5:
            anomalies.append({
                "node_id": "sensor_node_1",
                "confidence": anomaly_prob,
                "severity": "high" if anomaly_prob > 0.8 else "medium"
            })
        
        return anomalies
    
    def _generate_topology(self, anomalies: List[Dict]) -> Dict:
        """Generate network topology with anomaly status"""
        # Placeholder topology - replace with actual GNN topology
        nodes = []
        for i in range(10):  # Example: 10 nodes
            node_id = f"node_{i}"
            is_anomaly = any(a["node_id"] == node_id for a in anomalies)
            
            nodes.append({
                "id": node_id,
                "label": f"Sensor {i}",
                "status": "anomaly" if is_anomaly else "normal",
                "x": (i % 5) * 100,
                "y": (i // 5) * 100
            })
        
        # Example edges
        edges = [
            {"source": "node_0", "target": "node_1"},
            {"source": "node_1", "target": "node_2"},
            {"source": "node_2", "target": "node_3"},
            # Add more edges based on your actual topology
        ]
        
        return {"nodes": nodes, "edges": edges}

# Global model instance
model_inference = ModelInference()
