package demo.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@CrossOrigin(origins = "*")
public class WebcamController {

	@PostMapping("/upload")
	public void putWebcamData(@RequestParam(value = "data") MultipartFile data) throws IOException {
		if (!data.isEmpty()) {
			try {
				String uploadsDir = "c://uploads//";

				String orgName = data.getOriginalFilename();
				String filePath = uploadsDir + orgName.trim() + ".webm";

				File dest = new File(filePath);
				Path path = Paths.get(filePath);
				
				if (!dest.exists())
					data.transferTo(dest);
				else
					Files.write(path, data.getBytes(), StandardOpenOption.APPEND);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}
}
