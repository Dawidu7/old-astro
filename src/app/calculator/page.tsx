import Selects from "./Selects"
import { Box, Input, Separator } from "~/components"
import db from "~/db"
import type { Camera, FlattReduc, Telescope } from "~/db/schema"
import { round } from "~/lib/utils"

export default async function Calculator({ searchParams }: SearchParams) {
  const data = await getData()
  const outputs = getOutputData(searchParams)

  return (
    <Box className="flex max-w-5xl gap-4">
      <Selects options={data} searchParams={searchParams} />
      <Separator orientation="vertical" />
      <div className="flex-1 space-y-4">
        {outputs.map((output, i) => (
          <div className="flex justify-between" key={i}>
            {Object.entries(output).map(([label, value]) => (
              <Input key={label} label={label} value={value} isReadOnly />
            ))}
          </div>
        ))}
      </div>
    </Box>
  )
}

async function getData() {
  const [camera, flattReduc, telescope] = await Promise.all([
    db.query.camera.findMany(),
    db.query.flattReduc.findMany(),
    db.query.telescope.findMany(),
  ])

  return { camera, telescope, flattReduc }
}

function getOutputData(searchParams: Record<string, string | undefined>) {
  const _camera: Camera | null = searchParams.camera
    ? JSON.parse(searchParams.camera)
    : null
  const _flattReduc: FlattReduc | null = searchParams.flattReduc
    ? JSON.parse(searchParams.flattReduc)
    : null
  const _telescope: Telescope | null = searchParams.telescope
    ? JSON.parse(searchParams.telescope)
    : null

  const camera = {
    Resolution: _camera
      ? `${_camera.resolutionX}x${_camera.resolutionY}`
      : undefined,
    "Matrix Size": _camera
      ? `${_camera.matrixX}x${_camera.matrixY}`
      : undefined,
    "Pixel Size": _camera?.pixelSize.toString(),
  }

  const flattReduc = {
    Times: _flattReduc ? `x${_flattReduc.times}` : undefined,
  }

  const telescope = {
    "Focal Length": _telescope ? `${_telescope.focalLength}mm` : undefined,
    Diameter: _telescope ? `${_telescope.diameter}mm` : undefined,
    "Focal Ratio": _telescope ? `f ${_telescope.focalRatio}` : undefined,
  }

  const resolution =
    _camera && _flattReduc && _telescope
      ? round(
          (_camera.pixelSize / _telescope.focalLength) *
            206.265 *
            _flattReduc.times,
          2,
        )
      : undefined

  const results = {
    "Focal (Length / Ratio)":
      _flattReduc && _telescope
        ? `${_telescope.focalLength * _flattReduc.times}mm / f ${
            _telescope.focalRatio * _flattReduc.times
          }`
        : undefined,
    Resolution: resolution?.toString(),
    FOV:
      _camera && resolution
        ? `${round((_camera.resolutionX * resolution) / 3600, 2)}x${round(
            (_camera.resolutionY * resolution) / 3600,
            2,
          )}`
        : undefined,
  }

  return [camera, telescope, flattReduc, results]
}
