import tensorflow
import numpy as np
import sys
from tensorflow.keras.preprocessing.image import load_img, img_to_array

class_dict = {0: 'MildDemented', 1: 'ModerateDemented', 2: 'NonDemented', 3: 'VeryMildDemented'}
model = tensorflow.keras.models.load_model('model_1.h5')

img = load_img(sys.argv[1], target_size = (224,224,3))
img = img_to_array(img)
img = img/255

img = np.expand_dims(img,axis=0)
predict_x=model.predict(img) 
answer=np.argmax(predict_x,axis=1)
probability = round(np.max(predict_x*100),2)
print(probability, '% chances are there that the image is',class_dict[answer[0]])